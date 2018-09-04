const path = require('path');
const webpack = require('webpack');
const common = require('./common');
const babel = require('./babel-dev');

const cwd = process.cwd();
const plugin = require('../lib/server/plugin');

module.exports = function() {
  const browserBabel = babel.browser();
  let browserConfig = {
    name: '',
    mode: 'development',
    entry: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=false&noInfo=false',
      path.resolve(__dirname, '../lib/browser/index.jsx'),
    ],
    output: {
      path: path.resolve(cwd, './dist'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous', // 开启lazy-loading跨域请求以支持clue
    },
    optimization: {
      noEmitOnErrors: true,
      namedModules: true,
      splitChunks: common.getSplitChunks()
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: browserBabel,
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, '../lib'),
            /menreiki-ext-.+/,
            /dva-core[\\/]src/
          ],
          options: browserBabel,
        },
        {
          test: /[\\/](components|pages|layout)[\\/].*\.jsx$/, // only enabled for jsx
          exclude: /node_modules/,
          loader: 'react-hot-loader-loader',
        },
      ].concat(common.getCommonLoader()),
    },
    plugins: [
      new webpack.DefinePlugin(Object.assign({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }, common.getBrowserVariales())),
      new webpack.HotModuleReplacementPlugin(), // 添加module.hot支持
    ],
  };

  const webpackPlugin = plugin.run(plugin.stages.webpack);
  if (webpackPlugin.config) {
    browserConfig = webpackPlugin.config(browserConfig) || browserConfig;
  }

  return browserConfig;
};
