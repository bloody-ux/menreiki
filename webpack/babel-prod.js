const merge = require('babel-merge');
const path = require('path');
const baseConfig = require('./babel');

const cwd = process.cwd();
const menreikiConfigPath = path.resolve(cwd, 'menreiki.config.js');
const menreikiConfig = require(menreikiConfigPath);

exports.browser = function() {
  let config = merge({
    plugins: [ // 以下优化性能的插件请不要在dev模式下开启，否则会使得react-hot-loader报错（虽然工作）
      '@babel/transform-react-constant-elements',
      '@babel/transform-react-inline-elements',
    ],
  }, baseConfig);

  if (menreikiConfig.babel) {
    config = menreikiConfig.babel(config) || config;
  }

  return config;
};

exports.server = function() {
  let config = merge({
    plugins: [
      'transform-node-env-inline',
      '@babel/transform-react-constant-elements',
      '@babel/transform-react-inline-elements',
    ],
  }, baseConfig);

  if (menreikiConfig.babelServer) {
    config = menreikiConfig.babelServer(config) || config;
  }

  return config;
};
