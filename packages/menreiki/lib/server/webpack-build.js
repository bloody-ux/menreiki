const args = process.argv.slice(2);

const verbose = args.indexOf('-v') >= 0 || args.indexOf('--verbose') >= 0;

process.env.NODE_ENV = 'production';
process.env.OC_ENV = 'production';
const webpackConfig = require('../../webpack/prod');
const webpackCmd = require('./webpack');

webpackCmd.build(webpackConfig, {
  verbose: !!verbose,
});
