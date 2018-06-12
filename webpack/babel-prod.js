const merge = require('babel-merge');
const path = require('path');
const baseConfig = require('./babel');

const cwd = process.cwd();
const menreikiConfigPath = path.resolve(cwd, 'menreiki.config.js');
const menreikiConfig = require(menreikiConfigPath);

exports.browser = function() {
  let config = merge({
    plugins: [ // only enable below plugins in prod
      /*
      '@babel/transform-react-constant-elements',
      '@babel/transform-react-inline-elements',
      */
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
      /*
      '@babel/transform-react-constant-elements',
      '@babel/transform-react-inline-elements',
      */
    ],
  }, baseConfig);

  if (menreikiConfig.babelServer) {
    config = menreikiConfig.babelServer(config) || config;
  }

  return config;
};
