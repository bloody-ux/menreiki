const path = require('path');
const util = require('./util');

module.exports = function() {
  process.env.NODE_ENV = 'development';
  const webpackConfig = require('../webpack/dev');
  const webpackCmd = require('../lib/server/webpack');

  const menreikiConfigPath = path.join(process.cwd(), 'menreiki.config.js');
  util.checkMenreikiConfig(menreikiConfigPath);

  webpackCmd.dev(webpackConfig);
};
