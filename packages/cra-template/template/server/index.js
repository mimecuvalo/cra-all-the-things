import * as Sentry from '@sentry/node';
import * as cron from './cron';

import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import apiServer from './api/api';
import apolloServer from './data/apollo';
import appServer from './app/app';
import bodyParser from 'body-parser';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const FileStore = sessionFileStore(session);

// react-intl's requires DOMParser to be available globally so that XML message parsing is done correctly.
global.DOMParser = new (require('jsdom').JSDOM)().window.DOMParser;

// Called from scripts/serve.js to create the three apps we currently support: the main App, API, and Apollo servers.
export default function constructApps({ appName, productionAssetsByType, publicUrl, gitInfo }) {
  const app = express.Router();

  // Add basics: gzip, body parsing, cookie parsing.
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ type: ['json', 'application/csp-report'] }));
  app.use(cookieParser());

  // Helmet sets security headers via HTTP headers.
  // Learn more here: https://helmetjs.github.io/docs/
  app.use(function (req, res, next) {
    res.locals.nonce = uuidv4();
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          connectSrc: [process.env.NODE_ENV === 'development' ? '*' : "'self'"],
          defaultSrc: ["'none'"],
          fontSrc: ["'self'", 'https:'],
          frameAncestors: ["'self'"],
          frameSrc: ["'self'", 'http:', 'https:'],
          imgSrc: ['data:', 'http:', 'https:'],
          manifestSrc: ["'self'"],
          mediaSrc: ["'self'", 'blob:'],
          objectSrc: ["'self'"],
          reportUri: '/api/report-violation',
          scriptSrc: ["'self'", 'https://cdn.auth0.com', 'https://storage.googleapis.com'].concat(
            process.env.NODE_ENV === 'development' ? ["'unsafe-inline'"] : [(req, res) => `'nonce-${res.locals.nonce}'`]
          ),
          upgradeInsecureRequests: [],

          // XXX(mime): we have inline styles around - can we pass nonce around the app properly?
          styleSrc: ["'self'", 'https:', "'unsafe-inline'"], //(req, res) => `'nonce-${res.locals.nonce}'`],
        },
        reportOnly: process.env.NODE_ENV === 'development',
      },
    })
  );
  app.post('/api/report-violation', (req, res) => {
    console.log('CSP Violation: ', req.body || 'No data received!');
    res.status(204).end();
  });

  // Session store.
  // NOTE! We use a file storage mechanism which keeps things simple for purposes of ubiquity of this CRA package.
  // However, I recommend using `connect-redis` for a better session store.
  const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days.
  const sessionsSecret =
    process.env.REACT_APP_SESSION_SECRET || (process.env.NODE_ENV === 'development' ? 'dumbsecret' : null);

  let store;
  if (process.env.REACT_APP_REDIS_HOST && process.env.REACT_APP_REDIS_PORT) {
    const RedisStore = connectRedis(session);
    store = new RedisStore({
      host: process.env.REACT_APP_REDIS_HOST,
      port: process.env.REACT_APP_REDIS_PORT,
    });
  } else {
    store = new FileStore({ ttl: SESSION_MAX_AGE, logFn: () => {} });
  }

  app.use(
    session({
      store,
      secret: sessionsSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: SESSION_MAX_AGE * 1000 /* milliseconds */,
      },
    })
  );

  // Add XSRF/CSRF protection.
  const csrfMiddleware = csurf({
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
    },
  });

  // Set up API server.
  apiServer && app.use('/api', csrfMiddleware, apiServer({ appName }));

  // Set up Apollo server.
  apolloServer && apolloServer(app);

  // Create logger for app server to log requests.
  const appLogger = createLogger();

  // Background requests
  cron.startup();

  const dispose = () => {
    cron.shutdown();
  }; // Use this function in case you need to cleanup state before an HMR refresh.

  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      debug: process.env.NODE_ENV !== 'production',
    });
    app.use(Sentry.Handlers.requestHandler());
    app.use(async function (req, res, next) {
      if (req.session.user) {
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: req.session.user.model?.id,
            email: req.session.user.oauth.email,
          });
        });
      }
      next();
    });
    app.use(Sentry.Handlers.errorHandler());
  }

  // Our main request handler that kicks off the SSR, using the appServer which is compiled from serverCompiler.
  // `res` has the assets (via webpack's `stats` object) from the clientCompiler.
  app.get('/*', csrfMiddleware, (req, res, next) => {
    logRequest(appLogger, req, req.info || req.connection);
    const assetPathsByType =
      process.env.NODE_ENV === 'development' ? processAssetsFromWebpackStats(res) : productionAssetsByType;
    const nonce = res.locals.nonce;
    appServer({
      req,
      res,
      next,
      assetPathsByType,
      appName,
      nonce,
      publicUrl,
      gitInfo,
    });
  });

  return [app, dispose];
}

// Sets up winston to give us request logging on the main App server.
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
    remoteAddress: connection?.remoteAddress,
    remotePort: connection?.remotePort,
  });
}

// This magic function lets us extract the list of CSS/JS generated from webpack so
// that our server-side rendering can be complete. We take this list of assets and pass them to
// HTMLHead/HTMLBase.
// This is possible since we set `serverSideRender: true` in serve.js which sets res.locals.webpackStats.
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
