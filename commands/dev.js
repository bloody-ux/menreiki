const path = require('path');
const util = require('./util');

module.exports = function(cmd) {
  process.env.NODE_ENV = 'development';
  const webpackConfig = cmd.production ?
    require('../webpack/prod') :
    require('../webpack/dev');
  const webpackCmd = require('../lib/server/webpack');

  const menreikiConfigPath = path.join(process.cwd(), 'menreiki.config.js');
  util.checkMenreikiConfig(menreikiConfigPath);

  webpackCmd.dev(webpackConfig, {
    verbose: !!cmd.verbose,
  });
};
