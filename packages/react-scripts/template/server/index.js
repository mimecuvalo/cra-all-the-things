import apiServer from './api/api';
import apolloServer from './data/apollo';
import appServer from './app/app';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import express from 'express';
import path from 'path';
import winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

export default function constructApps({ appName, urls }) {
  const app = express.Router();

  // Add basics: gzip, body parsing, cookie parsing.
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Add XSRF/CSRF protection.
  const csrfMiddleware = csurf({ cookie: true });

  // Set up API server.
  apiServer && app.use('/api', csrfMiddleware, apiServer({ appName, urls }));

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
    appServer({ req, res, assetPathsByType, appName, urls, publicUrl: res.locals.webpackStats.toJson().publicPath });
  });

  return app;
}

function createLogger() {
  return winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      new WinstonDailyRotateFile({
        name: 'app',
        filename: path.resolve(process.cwd(), 'logs', 'app-%DATE%.log'),
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
