const fs = require('fs');

exports.checkMenreikiConfig = function(menreikiConfigPath) {
  if (!fs.existsSync(menreikiConfigPath)) {
    throw new Error(`menreiki.config.js doesn't exist in ${menreikiConfigPath}`);
  }

  const config = require(menreikiConfigPath);
  if (!config.routes) {
    throw new Error('`routes` required in `menreiki.config.js`');
  }

  if (!Array.isArray(config.routes)) {
    throw new Error('`routes` should be an array');
  }

  if (!config.routes.length) {
    throw new Error('the length of `routes` is 0');
  }
};
