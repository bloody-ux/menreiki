// 子进程， 用于真实的dev server运行
const args = process.argv.slice(2);

const production = args.indexOf('-p') >= 0 || args.indexOf('--production') >= 0;

process.env.NODE_ENV = production ? 'production' : 'development';
process.env.OC_ENV = 'dev';
const webpackConfig = production ?
  require('../../webpack/prod') :
  require('../../webpack/dev');

const webpackCmd = require('./webpack');

webpackCmd.dev(webpackConfig);
