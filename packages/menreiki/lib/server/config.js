const path = require('path');
const fs = require('fs');

const ocConfigPath = path.resolve(process.cwd(), 'menreiki.config.js');

if (!fs.existsSync(ocConfigPath)) {
  throw new Error(`menreiki.config.js doesn't exist in ${ocConfigPath}`);
}

module.exports = Object.assign({
  routesPath: './src/routes',
  elementId: '#app',
  router: 'browserRouter',
  host: 'localhost',
  port: 3001,
}, require(ocConfigPath));
