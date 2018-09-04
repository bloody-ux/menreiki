const proxyMiddleware = require('./proxy/proxyMiddleware');

class OcProxyPlugin {
  constructor(options) {
    this.options = options;
  }

  middleware({ middleware }) {
    middleware.push(proxyMiddleware);
  }
}

module.exports = OcProxyPlugin;
