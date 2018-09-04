/**
 * 定义一系列插件所需的运行时支持
 */
const resolve = require('resolve');
const config = require('./config');

const extensionPoints = Object.freeze({
  build: {
    render: null, // html渲染模板，用于dev/prod build
  },
  webpack: {
    config: null, // 用于处理webpack配置文件的函数，函数签名： webpackConfig => void | webpackConfig
  },
  babel: {
    config: null, // 用于处理babel配置文件的函数，函数签名： babelConfig => void | babelConfig
  },
  middleware: []
});

// 插件实例
const instances = [];

// 插件运行的各个阶段
exports.stages = {
  build: 'build',
  webpack: 'webpack',
  babel: 'babel',
  middleware: 'middleware'
};

exports.run = function(stage) {
  instances.forEach((instance) => {
    if (instance[stage]) {
      instance[stage].call(instance, extensionPoints);
    }
  });

  return extensionPoints[stage];
};

function loadPlugin(plugin) {
  if (!Array.isArray(plugin)) {
    plugin = [plugin];
  }

  const pluginPath = resolve.sync(plugin[0], {
    basedir: process.cwd(),
  });

  const Plugin = require(pluginPath);
  const instance = new Plugin(plugin[1]);

  instances.push(instance);
}

const plugins = config.plugins || [];
plugins.forEach(loadPlugin);
