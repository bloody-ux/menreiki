const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');

const ocConfig = require('../lib/server/config');

function getStyleLoader(isProd, enableModule = false, enableLess = false) {
  const result = [
    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: enableLess ? 2 : 1,
        modules: enableModule,
        camelCase: 'dashesOnly',
        localIdentName: '[local]___[hash:base64:5]'
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer(),
        ],
      },
    },
  ];

  if (enableLess) {
    result.push({
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
      },
    });
  }

  return result;
}

exports.getCommonLoader = function(isProd) {
  return [
    {
      test: function test(filePath) {
        return (/\.css$/.test(filePath) && !/\.local\.css$/.test(filePath)
        );
      },
      use: getStyleLoader(isProd, false, false),
    },
    {
      test: function test(filePath) {
        return (/\.less$/.test(filePath) && !/\.local\.less$/.test(filePath)
        );
      },
      use: getStyleLoader(isProd, false, true),
    },
    {
      test: /\.local.css$/,
      use: getStyleLoader(isProd, true, false),
    },
    {
      test: /\.local.less$/,
      use: getStyleLoader(isProd, true, true),
    },
    {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.html?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    },
  ];
};

exports.getBrowserVariales = function() {
  const cwd = process.cwd();

  // 代码级别配置文件
  let configPath = path.resolve(cwd, './src/config.js');
  if (!fs.existsSync(configPath)) {
    configPath = 'pd-empty-module';
  }

  return {
    ROUTESPATH: JSON.stringify(path.resolve(cwd, ocConfig.routesPath)),
    CONFIGPATH: JSON.stringify(configPath),
    ELEMENTID: JSON.stringify(ocConfig.elementId),
  };
};

exports.getSplitChunks = function() {
  return {
    cacheGroups: {
      vendors: {
        chunks: 'initial',
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -10,
        enforce: true
      },
      components: {
        chunks: 'initial',
        test: /(@alife[\\/]frog[\\/])|(antd[\\/])|(rc-.+)|(nprogress)|(css-animation)|(react-slick)/,
        name: 'components',
        priority: -5,
        reuseExistingChunk: true,
        enforce: true
      },
      biz: {
        chunks: 'async',
        priority: -20,
        name: 'biz',
        minChunks: 2,
        reuseExistingChunk: true,
        enforce: true
      },
      default: false
    }
  };
};
