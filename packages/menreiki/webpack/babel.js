// Babel 7 config
// 注意之所以用useBuiltIns：entry， 是为了解决诸如react需要使用Set/Map，saga需要使用Promise的问题
// 采用的方案是向全局注入，IE 10+ 不支持的polyfill
// 目前存在的问题是，部分npm包，默认使用了@babel的transform-runtime，导致了重复注入了Promise等library
module.exports = {
  presets: [
    ['@babel/env', {
      useBuiltIns: 'entry',
      exclude: ['es6.math.*', 'es6.reflect.*', 'es6.number.*', 'es6.regexp.*', 'es6.typed.*'],
      targets: {
        browsers: [
          '> 1%',
          'last 2 versions',
          'not IE < 10'
        ]
      }
    }],
    '@babel/react',
    require('menreiki-babel-preset') // staging-0-3的preset配置
  ],
  plugins: [
    ['@babel/transform-runtime', {
    }],
    ['path-chunk-name', {
      delay: true
    }],
    'lodash',
    ['import', {
      libraryName: '@alife/frog',
      style: true,
    }, 'frog'],
    ['import', {
      libraryName: 'antd',
      style: true,
    }, 'antd']
  ],
};
