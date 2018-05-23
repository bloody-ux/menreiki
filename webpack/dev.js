const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-css-chunks-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const fs = require('fs');
const merge = require('babel-merge');
const common = require('./common');
const babelConfig = require('./babel');

const cwd = process.cwd();
const menreikiConfigPath = path.resolve(cwd, 'menreiki.config.js');

const browserConfig = {
  name: 'client',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=false&noInfo=false',
    path.resolve(__dirname, '../lib/browser/index.jsx'),
  ],
  output: {
    path: path.resolve(cwd, './dist/client'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/',
  },
  devtool: 'sourcemap',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: merge({
          cacheDirectory: true,
          plugins: [
            'react-hot-loader/babel',
          ],
        }, babelConfig),
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../lib'),
        ],
        options: merge({
          cacheDirectory: true,
          plugins: [
            'react-hot-loader/babel',
          ],
        }, babelConfig),
      },
      {
        test: /\/(components|pages)\/.*\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader-loader',
      },
    ].concat(common.getCommonLoader()),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      MENREIKICONFIG: JSON.stringify(menreikiConfigPath),
    }),
    new ExtractTextPlugin({ // 支持对assets chunk的split
      filename: '[name].css',
    }),
    new webpack.optimize.CommonsChunkPlugin({ // 解决模块加载顺序问题引入的
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      minChunks: 3, // 至少一个module被3个地方引用才打入到common
      children: true,
      deepChildren: true,
    }),
    new webpack.HotModuleReplacementPlugin(), // 添加module.hot支持
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), // 出错时不产生（emit）assets
  ],
};


// 除了filter中的module，其他module都作为外部module加载
const externals = fs
  .readdirSync(path.resolve(cwd, 'node_modules'))
  .filter(x => !/\.bin|react-universal-component|menreiki|webpack-flush-chunks|react-dom\/server/.test(x))
  .reduce((modules, mod) => {
    modules[mod] = `commonjs ${mod}`;
    return modules;
  }, {});

const serverConfig = {
  name: 'server',
  entry: path.resolve(__dirname, '../lib/server/serverRender.js'),
  target: 'node',
  externals,
  output: {
    path: path.resolve(cwd, './dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'sourcemap',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: merge({

        }, babelConfig),
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../lib'),
        ],
        options: merge(babelConfig, {

        }),
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'css-loader/locals',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      MENREIKICONFIG: JSON.stringify(menreikiConfigPath),
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // 只产生1个chunk，从而将异步的chunk也打入到同一个包
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new WriteFilePlugin(), // 为了让vscode能够调试服务器代码
  ],
};

module.exports = [browserConfig, serverConfig];
