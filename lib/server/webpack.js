const express = require('express');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const colors = require('colors');
const detectPort = require('detect-port');
const open = require('open');

exports.dev = function dev(webpackConfig) {
  const { publicPath } = webpackConfig[0].output;

  webpackConfig.forEach((config) => {
    config.plugins.push(new webpack.ProgressPlugin((
      (percentage, msg, status) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write(colors.magenta('Σ #') + colors.magenta(status));
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log((`\nwebpack> ${config.name} bundle build is finished now.`).green);
        }
      })),
    );
  });

  const app = express();
  app.use(cors());
  app.use(favicon(path.join(__dirname, 'favicon.ico')));

  let isBuilt = false;
  const done = (result) => {
    if (isBuilt) return;

    const { stats } = result;
    let hasError = false;
    for (let i = 0; i < stats.length; i++) {
      if (stats[i].hasErrors() || stats[i].hasWarnings()) {
        hasError = true;
        break;
      }
    }

    detectPort(3001, (err, port) => {
      if (err) return console.error(err);

      return app.listen(port, () => {
        isBuilt = true;

        const serverRoot = `http://localhost:${port}`;
        if (hasError) {
          console.log(`BUILD COMPLETE WITH ERROR OR WARNING -- Listening @ ${serverRoot}`.red);
        } else {
          console.log(`BUILD COMPLETE -- Listening @ ${serverRoot}`.magenta);
        }

        open(serverRoot);
      });
    });
  };

  // added mockdata middleware
  app.use(require('../core/proxyMiddleware'));
  const compiler = webpack(webpackConfig);
  const clientCompiler = compiler.compilers[0];
  const options = { publicPath, stats: { colors: true, modules: false } };

  app.use(webpackDevMiddleware(compiler, options));
  app.use(webpackHotMiddleware(clientCompiler));
  app.use(webpackHotServerMiddleware(compiler));

  compiler.plugin('done', done);
};

exports.build = function build(webpackConfig, args) {
  webpack(webpackConfig).run((err, stats) => {
    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: args.verbse,
      modules: args.verbse,
      chunkModules: args.verbse,
      hash: args.verbse,
      version: args.verbse,
    });

    console.log(buildInfo);
  });
};
