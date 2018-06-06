const path = require('path');
const util = require('./util');

module.exports = function(cmd) {
  process.env.NODE_ENV = 'production';
  const webpackConfig = require('../webpack/prod');
  const webpackCmd = require('../lib/server/webpack');

  const menreikiConfigPath = path.join(process.cwd(), 'menreiki.config.js');
  util.checkMenreikiConfig(menreikiConfigPath);

  webpackCmd.build(webpackConfig, {
    verbose: !!cmd.verbose,
  });
};
