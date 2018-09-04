module.exports = function() {
  return {
    plugins: [
      require('@babel/plugin-proposal-json-strings'),
      require('@babel/plugin-syntax-dynamic-import'),
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-export-default-from')
    ],
    presets: [
    ],
  };
};
