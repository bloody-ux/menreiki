const path = require('path');
const chalk = require('chalk');
const minimatch = require('minimatch');
const mockLocal = require('./mockLocal');
const mockRemote = require('./mockRemote');

// add remote proxy to local
mockLocal.remote = mockRemote;

module.exports = (req, res, next) => {
  const configPath = path.resolve(process.cwd(), 'proxy.config.js');
  delete require.cache[configPath];
  const proxyConfig = require(configPath);
  const config = proxyConfig(mockLocal, mockRemote);
  const requestPath = req.path || req.pathname;

  for (let i = 0, l = config.length; i < l; i++) {
    const proxyKey = config[i][0];
    const actionPair = proxyKey.split(/\s+/); // [GET, xxxxx] or [xxxx]

    if (actionPair.length > 2) {
      console.error(chalk.red(`Incorrect proxy key: ${proxyKey}`));
      return;
    }

    const method = actionPair.length === 2 ? actionPair[0] : null;
    const realPath = actionPair.length === 2 ? actionPair[1] : actionPair[0];

    const isMatch = minimatch(requestPath, realPath) && (
      !method || method.toUpperCase() === req.method
    );

    if (isMatch) {
      // 第三个参数是代表排除在外的
      const excludeMatches = () => {
        let excludeItems = config[i][2];
        if (!excludeItems) return false;

        if (typeof excludeItems === 'string') {
          excludeItems = [excludeItems];
        }

        return excludeItems.some(exclude => minimatch(requestPath, exclude));
      };

      if (!excludeMatches()) {
        console.log('REQUEST:', chalk.green(requestPath), '=>', chalk.green(config[i][0]));
        config[i][1](req, res, next);
        return;
      }
    }
  }

  console.log('REQUEST: ', chalk.gray(requestPath), ' proxy not match');
  next();
};
