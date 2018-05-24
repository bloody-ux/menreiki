const fs = require('fs');

exports.checkMenreikiConfig = function(menreikiConfigPath) {
  if (!fs.existsSync(menreikiConfigPath)) {
    throw new Error(`menreiki.config.js doesn't exist in ${menreikiConfigPath}`);
  }
};
