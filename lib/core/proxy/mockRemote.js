const HttpProxy = require('http-proxy');

function request(req, res, options) {
  const proxy = new HttpProxy();
  proxy.web(req, res, options);
}

module.exports = request;
