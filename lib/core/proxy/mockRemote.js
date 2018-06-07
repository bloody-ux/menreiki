const HttpProxy = require('http-proxy');
const colors = require('colors');

function request(req, res, options) {
  const proxy = new HttpProxy();

  console.log('FORWARD: ', colors.green(options.target || options.forward));
  console.log();
  proxy.web(req, res, options);
}

module.exports = request;
