module.exports = {
  presets: [
    '@babel/env',
    '@babel/react',
    ['@babel/stage-0', { decoratorsLegacy: true }],
  ],
  plugins: [
    '@babel/transform-runtime',
    'universal-import2',
    ['transform-flow-interface-imports', {
      modules: [{
        isRegExp: true,
        name: '/interfaces/',
      }],
    }],
  ],
};
