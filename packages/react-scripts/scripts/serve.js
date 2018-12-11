'use strict';

const bodyParser = require('body-parser');
const compression = require('compression');
const configFactory = require('../config/webpack.config');
const cookieParser = require('cookie-parser');
const { createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const csurf = require('csurf');
const express = require('express');
const MemoryFS = require('memory-fs');
const openBrowser = require('react-dev-utils/openBrowser');
const path = require('path');
const paths = require('../config/paths');
const proxy = require('http-proxy-middleware');
const requireFromString = require('require-from-string');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

function startAppServer(clientCompiler, clientPort, appName, useYarn) {
  // Create a server build with an entry point at /server/App.js
  // Note the SSR boolean flag passed to configFactory.
  const serverConfig = configFactory(process.env.NODE_ENV, true /* SSR */);

  // Create our express app.
  const realExpressApp = express();

  // Setup webpackDevMiddleware so that the next middleware gets `webpackStats` in its `locals`.
  // This is so we can get the assets list (CSS + JS) and insert them in our SSR appropriately.
  // TODO(mime): ostensibly, this shouldn't be used in prod...better ideas?
  realExpressApp.use(
    webpackDevMiddleware(clientCompiler, {
      logLevel: 'warn',
      serverSideRender: true,
      publicPath: serverConfig.output.publicPath,
    })
  );

  let app = undefined;
  // This neat trick lets us create routes dynamically at runtime.
  // Useful since Apollo does `schema.applyMiddleware({ app });`
  // Otherwise, we wouldn't need to do this dance.
  realExpressApp.use(function(req, res, next) {
    app(req, res, next);
  });

  // createCompiler adds logging / console nicities to our compiler.
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const SERVER_HOST = process.env.HOST || '0.0.0.0';
  const SERVER_PORT = process.env.REACT_APP_SSR_PORT || 3001;
  const urls = prepareUrls(protocol, SERVER_HOST, SERVER_PORT);
  const serverCompiler = createCompiler(webpack, serverConfig, `${appName}-server`, urls, useYarn);

  // Set the file system for the server compiler to be in-memory, we don't need the files actually outputted.
  const fs = new MemoryFS();
  serverCompiler.outputFileSystem = fs;

  // We watch for changes on the server and change the appServer when it is recompiled.
  serverCompiler.watch(serverConfig.watchOptions, (err, stats) => {
    const contents = fs.readFileSync(path.resolve(process.cwd(), 'dist', serverConfig.output.filename), 'utf8');
    const { apiServer, apolloServer, appServer } = requireFromString(contents, serverConfig.output.filename);
    app = constructApps({ apiServer, apolloServer, appServer, clientPort, appName });
  });

  let firstCompileDone = false;
  // We listen for our initial compilation to complete and then kick off our node server.
  serverCompiler.hooks.done.tap('server-done', stats => {
    if (firstCompileDone) {
      return;
    }

    firstCompileDone = true;
    // Finally, kick off our Express server.
    realExpressApp.listen(SERVER_PORT, () => {
      openBrowser(urls.localUrlForBrowser);
    });
  });
}

function constructApps({ apiServer, apolloServer, appServer, clientPort, appName }) {
  const app = express.Router();

  // Add basics: gzip, body parsing, cookie parsing.
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Add XSRF/CSRF protection.
  const csrfMiddleware = csurf({ cookie: true });

  // In development, create a proxy bridge to the regular client build to get hot updates (HMR).
  if (process.env.NODE_ENV === 'development') {
    console.log('Setting up proxy from SSR server → WebpackDevServer for HMR support...');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const HOST = process.env.HOST || '0.0.0.0';
    app.use(
      ['/sockjs-node'],
      proxy({
        target: `${protocol}://${HOST}:${clientPort}`,
        changeOrigin: true,
        ws: true,
      })
    );
  }

  // Hook up paths to the public (except / and index.html)
  app.use(unless(express.static(paths.appPublic), '/', '/index.html'));

  // Set up API server.
  apiServer && app.use('/api', csrfMiddleware, apiServer);

  // XXX(mime): Not ideal. The GraphQL playground needs the csrf token to work so it's disabled in dev mode :-/
  if (process.env.NODE_ENV === 'production') {
    app.use('/graphql', csrfMiddleware, (req, res, next) => next());
  }
  // Set up Apollo server.
  apolloServer && apolloServer(app);

  // Create logger for app server to log requests.
  const appLogger = createLogger();

  // Our main request handler that kicks off the SSR, using the appServer which is compiled from serverCompiler.
  // `res` has the assets (via webpack's `stats` object) from the clientCompiler.
  app.get('/*', csrfMiddleware, (req, res) => {
    logRequest(appLogger, req, req.info || req.connection);
    const assetPathsByType = processAssetsFromWebpackStats(res);
    appServer({ req, res, assetPathsByType, appName, publicUrl: res.locals.webpackStats.toJson().publicPath });
  });

  return app;
}

function createLogger() {
  return winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      new WinstonDailyRotateFile({
        name: 'app',
        filename: path.resolve(paths.logPath, 'app-%DATE%.log'),
        zippedArchive: true,
      }),
    ],
  });
}

function logRequest(appLogger, req, connection) {
  appLogger.info({
    id: req.id,
    method: req.method,
    url: req.url,
    headers: req.headers,
    remoteAddress: connection && connection.remoteAddress,
    remotePort: connection && connection.remotePort,
  });
}

function processAssetsFromWebpackStats(res) {
  const webpackStats = res.locals.webpackStats.toJson();
  const extensionRegexp = /\.(css|js)(\?|$)/;
  const entrypoints = Object.keys(webpackStats.entrypoints);
  const assetDuplicateCheckMap = {};
  const assetPathsByType = {
    css: [],
    js: [],
  };
  for (const entrypoint of entrypoints) {
    for (const assetPath of webpackStats.entrypoints[entrypoint].assets) {
      const extMatch = extensionRegexp.exec(assetPath);
      if (!extMatch) {
        continue;
      }

      const publicPath = webpackStats.publicPath + assetPath;
      if (assetDuplicateCheckMap[publicPath]) {
        continue;
      }

      assetDuplicateCheckMap[publicPath] = true;
      const extension = extMatch[1];
      assetPathsByType[extension].push(publicPath);
    }
  }

  return assetPathsByType;
}

const unless = function(middleware, ...paths) {
  return function(req, res, next) {
    const pathCheck = paths.some(path => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};

module.exports = startAppServer;
