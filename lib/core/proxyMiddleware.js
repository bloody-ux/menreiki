const path = require('path');
const minimatch = require('minimatch');
const mock = require('./mock');
const colors = require('colors');

module.exports = (req, res, next) => {
  const configPath = path.resolve(process.cwd(), 'proxy.config.js');
  delete require.cache[configPath];
  const proxyConfig = require(configPath);
  const config = proxyConfig(mock);
  const requestPath = req.path || req.pathname;

  for (let i = 0, l = config.length; i < l; i++) {
    if (minimatch(requestPath, config[i][0])) {
      // 第三个参数是代表排除在外的
      if (!config[i][2] || !minimatch(requestPath, config[i][2])) {
        config[i][1](req, res);
        console.log('REQUEST:', colors.green(requestPath), '=>', colors.green(config[i][0]));
        return;
      }
    }
  }

  console.log('REQUEST: ', colors.gray(requestPath), ' proxy not match');
  next();
};
