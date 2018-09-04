const baseConfig = require('./babel');

const plugin = require('../lib/server/plugin');

exports.browser = function() {
  let config = Object.assign({}, baseConfig);
  /*
  '@babel/transform-react-constant-elements',
  '@babel/transform-react-inline-elements',
  */

  const babelPlugin = plugin.run(plugin.stages.babel);
  if (babelPlugin.config) {
    config = babelPlugin.config(config) || config;
  }

  return config;
};
