const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-css-chunks-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const fs = require('fs');
const merge = require('babel-merge');
const common = require('./common');
const babelConfig = require('./babel');

const cwd = process.cwd();
const menreikiConfigPath = path.join(cwd, 'menreiki.config.js');

const browserConfig = {
  name: 'client',
  entry: path.join(__dirname, '../lib/browser/index.jsx'),
  output: {
    path: path.resolve(cwd, './dist/client'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },
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
          plugins: [ // 以下优化性能的插件请不要在dev模式下开启，否则会使得react-hot-loader报错（虽然工作）
            '@babel/transform-react-constant-elements',
            '@babel/transform-react-inline-elements',
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
          plugins: [ // 以下优化性能的插件请不要在dev模式下开启，否则会使得react-hot-loader报错（虽然工作）
            '@babel/transform-react-constant-elements',
            '@babel/transform-react-inline-elements',
          ],
        }, babelConfig),
      },
    ].concat(common.getCommonLoader()),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
      MENREIKICONFIG: JSON.stringify(menreikiConfigPath),
    }),
    new ExtractTextPlugin({ // 支持对assets chunk的split
      filename: '[name].css',
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
    new webpack.optimize.CommonsChunkPlugin({ // 解决模块加载顺序问题引入的
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      minChunks: 3,
      children: true,
      deepChildren: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(), // 出错时不产生（emit）assets
    new ParallelUglifyPlugin({
      uglifyJS: {},
    }),
    new webpack.HashedModuleIdsPlugin(),
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
  entry: path.join(__dirname, '../lib/server/serverRender.js'),
  target: 'node',
  externals,
  output: {
    path: path.resolve(cwd, './dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
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
          plugins: [
            'transform-node-env-inline',
            '@babel/transform-react-constant-elements',
            '@babel/transform-react-inline-elements',
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
          plugins: [
            'transform-node-env-inline',
            '@babel/transform-react-constant-elements',
            '@babel/transform-react-inline-elements',
          ],
        }, babelConfig),
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
        NODE_ENV: JSON.stringify('production'),
      },
      MENREIKICONFIG: JSON.stringify(menreikiConfigPath),
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = [browserConfig, serverConfig];
