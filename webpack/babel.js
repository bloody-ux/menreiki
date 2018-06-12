// Babel 7 config
// module.exports = {
//   presets: [
//     '@babel/env',
//     '@babel/react',
//     ['@babel/stage-0', { decoratorsLegacy: true }],
//   ],
//   plugins: [
//     '@babel/transform-runtime',
//     'universal-import2',
//     ['transform-flow-interface-imports', {
//       modules: [{
//         isRegExp: true,
//         name: '/interfaces/',
//       }],
//     }],
//   ],
// };

// babel 6 config
module.exports = {
  presets: [
    'babel-preset-env',
    'babel-preset-react',
    'babel-preset-stage-0',
  ],
  plugins: [
    'transform-runtime',
    'universal-import2',
    'syntax-dynamic-import',
    'transform-decorators-legacy',
    ['transform-flow-interface-imports', {
      modules: [{
        isRegExp: true,
        name: '/interfaces/',
      }],
    }],
  ],
};

