// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
// NOTE(all-the-things): these are now set by serve-dev.js and serve-prod.js, respectively.
//process.env.BABEL_ENV = 'development';
//process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  console.error(err);
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');
verifyTypeScriptSetup();
// @remove-on-eject-end

const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const { choosePort, prepareProxy, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const startAppServer = require('./serve');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`)
  );
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`);
  console.log();
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    // TODO(mime): can I consolidate this / eliminate this instead of the whole proxying trick while keeping HMR?
    const config = configFactory(process.env.NODE_ENV, false /* SSR */);
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
    const urls = prepareUrls(protocol, HOST, port);
    const devSocket = {
      warnings: warnings => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
    };

    // Create a webpack compiler that is configured with custom messages.
    // NOTE(all-the-things): we remove the custom messages here in lieu of the server ones (which are dupes basically).
    const compiler = process.env.NODE_ENV == 'production' ? null : webpack(config);

    if (isInteractive) {
      clearConsole();
    }
    console.log(
      chalk.cyan(
        process.env.NODE_ENV == 'production'
          ? 'Starting the production server...'
          : 'Starting both the WebpackDevServer and App server...\n'
      )
    );

    // We used to support resolving modules according to `NODE_PATH`.
    // This now has been deprecated in favor of jsconfig/tsconfig.json
    // This lets you use absolute paths in imports inside large monorepos:
    if (process.env.NODE_PATH) {
      console.log(
        chalk.yellow(
          'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
        )
      );
      console.log();
    }

    // Start our app server which does server-side rendering. We pass it our client's webpack compiler in development
    // mode so that we can render the assets during rendering. Otherwise, we retrieve the static build assets in
    // serve.js via getProductionAssetsByType.
    startAppServer({
      clientCompiler: compiler,
      clientPort: port,
      appName,
      devSocket,
      useTypeScript,
      tscCompileOnError,
      useYarn
    });

    let devServer;
    if (process.env.NODE_ENV == 'development') {
      // Load proxy config
      const proxySetting = require(paths.appPackageJson).proxy;
      const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
      // Serve webpack assets generated by the compiler over a web server.
      const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
      devServer = new WebpackDevServer(compiler, serverConfig);
      // Launch WebpackDevServer.
      devServer.listen(port, HOST, err => {
        if (err) {
          return console.log(err);
        }
      });
    }

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer && devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
