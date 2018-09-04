const HttpProxy = require('http-proxy');
const chalk = require('chalk');

function res500(res, error) {
  res.status(500);
  res.set('Content-Type', 'text/html;charset=utf-8');
  console.error(chalk.red(error.stack));
  console.trace();
  return res.end(error.stack);
}

function fixHost(proxyReq, req, res, options) {
  const { target, forward } = options;
  const host = (target && target.host) || (forward && forward.host);

  // 通过设置目标服务器为host，从而正确
  proxyReq.setHeader('Host', host);
}

function request(req, res, options, next) {
  const proxy = new HttpProxy();

  console.log('FORWARD: ', chalk.green(options.target || options.forward));
  console.log();

  proxy.on('proxyReq', fixHost);
  proxy.on('error', next || (err => res500(res, err)));

  proxy.web(req, res, options); // 不能按照http-proxy文档写的传入next到第四个参数来处理error
}

module.exports = request;
