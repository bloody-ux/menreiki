class WebpackPlugin {
  /**
   * options: {
   *  webpack?: webpackConfig => void | webpackConfig
   *  babel?: babelConfig => void | babelConfig
   * }
   */
  constructor(options) {
    this.options = options || {};
  }

  webpack({ webpack }) {
    webpack.config = this.options.webpack;
  }

  babel({ babel }) {
    babel.config = this.options.babel;
  }
}

module.exports = WebpackPlugin;
