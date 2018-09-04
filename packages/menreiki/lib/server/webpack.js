const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const chalk = require('chalk');
const detectPort = require('detect-port');
const openBrowser = require('react-dev-utils/openBrowser');

const plugin = require('./plugin');
const serve = require('./serve');
const ocConfig = require('./config');

function supportProgress(config) {
  config.plugins.push(new webpack.ProgressPlugin((
    (percentage, msg, status) => {
      const stream = process.stderr;
      if (stream.isTTY && msg === 'building modules') {
        if (!status) return;
        stream.cursorTo(0);
        stream.write(chalk.magenta('Σ #') + chalk.magenta(status));
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log(chalk.green(`\nwebpack> ${config.name} bundle build is finished now.`));
      }
    })));
}

function errorHandler(err, req, res, next) {
  if (err instanceof Error) {
    console.error(err);
    console.trace();
    res.status(500).send(err.stack);
  } else {
    next();
  }
}

exports.dev = function dev(webpackConfigFactory) {
  const webpackConfig = webpackConfigFactory();

  const { publicPath } = webpackConfig.output;
  supportProgress(webpackConfig);

  const app = express();

  let isBuilt = false;
  const done = (stats) => {
    if (isBuilt) return;

    const { host, port } = ocConfig;
    detectPort(port, (err, realPort) => {
      if (err) return console.error(err);

      return app.listen(realPort, () => {
        isBuilt = true;

        app.use(serve.httpHandler(stats));

        const serverRoot = realPort === 80 ?
          `http://${host}` :
          `http://${host}:${realPort}`;

        if (stats.hasErrors()) {
          console.log(chalk.red(`BUILD COMPLETE WITH ERROR -- Listening @ ${serverRoot}`));
        } else if (stats.hasWarnings()) {
          console.log(chalk.yellowBright(`BUILD COMPLETE WITH WARNING -- Listening @ ${serverRoot}`));
        } else {
          console.log(chalk.magenta(`BUILD COMPLETE -- Listening @ ${serverRoot}`));
        }

        openBrowser(serverRoot);
      });
    });
  };

  plugin
    .run(plugin.stages.middleware)
    .forEach(middleware => app.use(middleware));

  const compiler = webpack(webpackConfig);
  const options = { publicPath, stats: { colors: true, modules: false } };

  const instance = webpackDevMiddleware(compiler, options);
  app.use(instance);
  app.use(webpackHotMiddleware(compiler));
  app.use(errorHandler);

  compiler.hooks.done.tap('webpackBuild', done);
};

exports.build = function build(webpackConfigFactory, args) {
  const webpackConfig = webpackConfigFactory();
  supportProgress(webpackConfig);

  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }

      process.exit(1);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: false,
      chunks: args.verbose,
      modules: args.verbose,
      chunkModules: args.verbose,
      hash: args.verbose,
      version: args.verbose,
    });

    console.log(buildInfo);

    const dist = webpackConfig.output.path;
    serve.createIndex(stats, dist);

    // 如果编译出错，告知调用方，否则上层无法感知
    if (stats.hasErrors()) {
      process.exit(1);
    }
  });
};
