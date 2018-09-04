const baseConfig = require('./babel');

const plugin = require('../lib/server/plugin');

exports.browser = function() {
  let config = Object.assign({}, baseConfig);
  config.plugins.push('react-hot-loader/babel');
  config.plugins.push('dva-core-hmr'); // added hmr support for dva models
  config.cacheDirectory = true;

  const babelPlugin = plugin.run(plugin.stages.babel);
  if (babelPlugin.config) {
    config = babelPlugin.config(config) || config;
  }

  return config;
};
