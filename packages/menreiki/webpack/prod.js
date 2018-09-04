const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./common');
const babel = require('./babel-prod');

const cwd = process.cwd();
const plugin = require('../lib/server/plugin');

const pkg = require(path.join(cwd, 'package.json'));

module.exports = function() {
  const browserBabel = babel.browser();
  let browserConfig = {
    name: '',
    mode: 'production',
    entry: path.join(__dirname, '../lib/browser/index.jsx'),
    output: {
      path: path.resolve(cwd, './dist'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous', // 开启lazy-loading跨域请求以支持clue
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
      },
    },
    optimization: {
      noEmitOnErrors: true,
      concatenateModules: false,
      splitChunks: common.getSplitChunks()
    },
    devtool: 'hidden-source-map',
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
            /dva-core[\\/]src/ // 去除dva-core本身无意义的babel-polyfill引用，避免重复引入不同路径的core-js
          ],
          options: browserBabel,
        },
      ].concat(common.getCommonLoader(true)),
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: `/*! ${pkg.name} | v${pkg.version} | ${new Date().toString()} */`,
        raw: true,
      }),
      new webpack.DefinePlugin(Object.assign({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        }
      },
      common.getBrowserVariales()
      )),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
          map: {
            inline: false,
          },
        },
      }),
      new webpack.HashedModuleIdsPlugin(),
    ],
  };

  const webpackPlugin = plugin.run(plugin.stages.webpack);
  if (webpackPlugin.config) {
    browserConfig = webpackPlugin.config(browserConfig) || browserConfig;
  }

  return browserConfig;
};
