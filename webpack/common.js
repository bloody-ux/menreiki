const ExtractTextPlugin = require('extract-css-chunks-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.getCommonLoader = function() {
  return [
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
            },
          },
        ],
      }),
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      }),
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

