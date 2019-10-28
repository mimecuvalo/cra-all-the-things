'use strict';

const configFactory = require('../config/webpack.config');
const { createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const { exec } = require('child_process');
const express = require('express');
const MemoryFS = require('memory-fs');
const openBrowser = require('react-dev-utils/openBrowser');
const path = require('path');
const paths = require('../config/paths');
const { promisify } = require('util');
const proxy = require('http-proxy-middleware');
const requireFromString = require('require-from-string');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

function startAppServer({ clientCompiler, clientPort, appName, devSocket, useTypeScript, tscCompileOnError, useYarn }) {
  // Create a server build with an entry point at /server/App.js
  // Note the SSR boolean flag passed to configFactory.
  const serverConfig = configFactory(process.env.NODE_ENV, true /* SSR */);

  // Create our express app.
  const topLevelApp = express();

  // In development, create a proxy bridge to the regular client build to get hot updates (HMR).
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  if (process.env.NODE_ENV === 'development') {
    console.log('Setting up proxy from SSR server → WebpackDevServer for HMR support...');
    const HOST = process.env.HOST || '0.0.0.0';
    topLevelApp.use(
      ['/sockjs-node', '/__get-internal-source*', '/__open-stack-frame-in-editor', '/service-worker.js'],
      proxy({
        target: `${protocol}://${HOST}:${clientPort}`,
        changeOrigin: true,
        ws: true,
      })
    );
  }

  // Hook up paths to the public (except / and index.html)
  topLevelApp.use(unless(express.static(paths.appPublic), '/', '/index.html'));

  // If production, wire up build directory to serve up directly.
  if (process.env.NODE_ENV === 'production') {
    topLevelApp.use(express.static(paths.appBuild));
  } else {
    // Setup webpackDevMiddleware so that the next middleware gets `webpackStats` in its `locals`.
    // This is so we can get the assets list (CSS + JS) and insert them for the purpose of server-side rendering.
    topLevelApp.use(
      webpackDevMiddleware(clientCompiler, {
        logLevel: 'warn',
        serverSideRender: true,
        publicPath: serverConfig.output.publicPath,
      })
    );
  }

  let app;
  let dispose;
  // This neat trick lets us create routes dynamically at runtime.
  // Useful since Apollo does `schema.applyMiddleware({ app });`
  // Otherwise, we wouldn't need to do this dance.
  topLevelApp.use(function(req, res, next) {
    app(req, res, next);
  });

  // createCompiler adds logging / console nicities to our compiler.
  const SERVER_HOST = process.env.HOST || '0.0.0.0';
  const SERVER_PORT = process.env.REACT_APP_SSR_PORT || 3001;
  const urls = prepareUrls(protocol, SERVER_HOST, SERVER_PORT);

  const serverCompiler = createCompiler({
    webpack,
    config: serverConfig,
    appName: `${appName}-server`,
    urls,
    devSocket,
    useTypeScript,
    tscCompileOnError,
    useYarn,
  });

  // Set the file system for the server compiler to be in-memory, we don't need the files actually outputted.
  const fs = new MemoryFS();
  serverCompiler.outputFileSystem = fs;
  const getConstructApps = () => {
    const contents = fs.readFileSync(path.resolve(process.cwd(), 'dist', serverConfig.output.filename), 'utf8');
    return requireFromString(contents, serverConfig.output.filename).default;
  };

  const publicUrl = serverConfig.output.publicPath;
  if (process.env.NODE_ENV === 'production') {
    serverCompiler.run(async () => {
      try {
        const constructApps = getConstructApps();
        const productionAssetsByType = getProductionAssetsByType();
        const gitInfo = await getGitInfo();

        // eslint-disable-next-line require-atomic-updates
        [app, dispose] = constructApps({ appName, productionAssetsByType, publicUrl, gitInfo });
      } catch (ex) {
        console.log(ex);
      }
    });
  } else {
    // We watch for changes on the server and change the appServer when it is recompiled.
    serverCompiler.watch(serverConfig.watchOptions, async () => {
      try {
        dispose && dispose(); // Cleanup previous instance.
        const constructApps = getConstructApps();
        const gitInfo = await getGitInfo();

        // eslint-disable-next-line require-atomic-updates
        [app, dispose] = constructApps({ appName, publicUrl, gitInfo });
      } catch (ex) {
        console.log(ex);
      }
    });
  }

  let firstCompileDone = false;
  // We listen for our initial compilation to complete and then kick off our node server.
  serverCompiler.hooks.done.tap('server-done', () => {
    if (firstCompileDone) {
      return;
    }

    firstCompileDone = true;
    // Finally, kick off our Express server.
    topLevelApp.listen(SERVER_PORT, () => {
      openBrowser(urls.localUrlForBrowser);
    });
  });
}

const unless = function(middleware, ...paths) {
  return function(req, res, next) {
    const pathCheck = paths.some(path => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};

function getProductionAssetsByType() {
  let assetManifest;
  try {
    assetManifest = require(`${paths.appBuild}/asset-manifest.json`)['files'];
  } catch (ex) {
    console.log(`Your asset-manifest.json file could not be found. Run ``npm run build`` to generate it.`);
    throw new Error('need to run build first');
  }

  // XXX(mime): this can't be the correct of doing this... errr.
  const assetKeys = Object.keys(assetManifest);
  const runtimeIndex = assetKeys.indexOf('runtime~main.js.map');
  const bundleKey = assetKeys[runtimeIndex + 1];

  const js = [assetManifest['runtime~main.js'], assetManifest[bundleKey], assetManifest['main.js']];
  const css = [assetManifest['main.css']];

  return { css, js };
}

async function getGitInfo() {
  // Calculate an app version and time so that we can give our clients some kind of versioning scheme.
  // This lets us make sure that if there are bad / incompatible clients in the wild later on, we can
  // disable certain clients using their version number and making sure they're upgraded to the
  // latest, working version.
  const execPromise = promisify(exec);

  let gitRev, gitTime;
  try {
    gitRev = (await execPromise('git rev-parse HEAD')).stdout.trim();
    gitTime = (await execPromise('git log -1 --format=%cd --date=unix')).stdout.trim();
  } catch (ex) {
    try {
      const gitInfo = require(`${paths.appPath}/.cra-all-the-things-prod-git-info.json`);
      gitRev = gitInfo.gitRev;
      gitTime = gitInfo.gitTime;
    } catch (ex) {
      gitRev = 1;
      gitTime = 1;
    }
  }

  return { gitRev, gitTime };
}

module.exports = startAppServer;
