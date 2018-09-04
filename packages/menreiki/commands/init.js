const ocInit = require('menreiki-init');
const pkg = require('../package.json');

module.exports = function(cmd) {
  ocInit(pkg, cmd.plugin ? 'plugin' : '');
};
