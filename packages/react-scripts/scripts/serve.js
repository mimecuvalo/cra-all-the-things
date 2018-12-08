'use strict';

const bodyParser = require('body-parser');
const compression = require('compression');
const configFactory = require('../config/webpack.config');
const { createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
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

const addAPIToApp = require(path.resolve(paths.appServerSrc, 'api', 'api'));
const addGraphQLToApp = require(path.resolve(paths.appServerSrc, 'graphql', 'apollo'));

function startAppServer(clientCompiler, clientPort, appName, useYarn) {
  const app = express();
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  if (process.env.NODE_ENV === 'development') {
    console.log('Setting up proxy from SSR server → WebpackDevServer for HMR support...');
    // In development, create a proxy bridge to the regular client build to get hot updates (HMR).
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

  const appLogger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      new WinstonDailyRotateFile({
        name: 'app',
        filename: path.resolve(paths.logPath, 'app-%DATE%.log'),
        zippedArchive: true,
      }),
    ],
  });

  // Create a server build with an entry point at /server/App.js
  // Note the SSR boolean flag passed to configFactory.
  const serverConfig = configFactory(process.env.NODE_ENV, true /* SSR */);

  // createCompiler adds logging / console nicities to our compiler.
  const SERVER_HOST = process.env.HOST || '0.0.0.0';
  const SERVER_PORT = process.env.REACT_APP_SSR_PORT || 3001;
  const urls = prepareUrls(protocol, SERVER_HOST, SERVER_PORT);
  const serverCompiler = createCompiler(webpack, serverConfig, `${appName}-server`, urls, useYarn);

  // Set the file system for the server compiler to be in-memory, we don't need the files actually outputted.
  const fs = new MemoryFS();
  serverCompiler.outputFileSystem = fs;

  // We watch for changes on the server and change the serverApp when it is recompiled.
  let serverApp;
  serverCompiler.watch(serverConfig.watchOptions, (err, stats) => {
    const contents = fs.readFileSync(path.resolve(process.cwd(), 'dist', serverConfig.output.filename), 'utf8');
    serverApp = requireFromString(contents, serverConfig.output.filename).default;
  });

  // Hook up paths to the public (except / and index.html)
  app.use(unless(express.static(paths.appPublic), '/', '/index.html'));

  // Hook up API.
  addAPIToApp(app);

  // Hook up GraphQL and Apollo.
  addGraphQLToApp(app);

  // Setup webpackDevMiddleware so that the next middleware gets `webpackStats` in its `locals`.
  // This is so we can get the assets list (CSS + JS) and insert them in our SSR appropriately.
  // TODO(mime): ostensibly, this shouldn't be used in prod...better ideas?
  app.use(
    webpackDevMiddleware(clientCompiler, {
      logLevel: 'warn',
      serverSideRender: true,
      publicPath: serverConfig.output.publicPath,
    })
  );
  // Our main request handler that kicks off the SSR, using the serverApp which is compiled from serverCompiler.
  // `res` has the assets (via webpack's `stats` object) from the clientCompiler.
  app.get('/*', (req, res) => {
    const assetPathsByType = processAssetsFromWebpackStats(res);
    const connection = req.info || req.connection;
    appLogger.info({
      id: req.id,
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: connection && connection.remoteAddress,
      remotePort: connection && connection.remotePort,
    });
    serverApp({ req, res, assetPathsByType, appName, publicUrl: res.locals.webpackStats.toJson().publicPath });
  });

  let firstCompileDone = false;
  serverCompiler.hooks.done.tap('server-done', stats => {
    if (firstCompileDone) {
      return;
    }

    firstCompileDone = true;
    // Finally, kick off our Express server.
    app.listen(SERVER_PORT, () => {
      openBrowser(urls.localUrlForBrowser);
    });
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
