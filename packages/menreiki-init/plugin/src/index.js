class OcPlugin {
  constructor(options) {
    this.options = options;
  }

  // // 用于修改webpack配置
  // webpack({ webpack }) {
  //   webpack.config = function(webpackConfig) {
  //     return webpackConfig;
  //   };
  // }

  // // 用于修改babel配置
  // babel({ babel }) {
  //   babel.config = function(babelConfig) {
  //     return babelConfig;
  //   };
  // }

  // // 用于修改生成的html
  // build({ build }) {
  //   // render用于最终生成html
  //   build.render = function({
  //     styles, js, elementId, publicPath, isDevServer
  //   }) {
  //     console.log(isDevServer);

  //     return `
  //       <!DOCTYPE html>
  //       <html>
  //         <head>
  //           ${styles.map(style => `<link rel="stylesheet" href="${publicPath}/${style}" />`).join('\n')}
  //         </head>
  //         <body>
  //           <div id="${elementId.substring(1)}"></div>
  //           ${js.map(js.map(script => `<script crossorigin type="text/javascript" src="${publicPath}/${script}" defer></script>`).join('\n'))}
  //         </body>
  //       </html>
  //     `;
  //   };
  // }

  // // 给开发服务器添加新的middleware，优先级高于默认的middleware
  // middleware({ middleware }) {
  //   middleware.push((req, res, next) => {
  //     console.log(req, res, next);
  //   });
  // }
}

module.exports = OcPlugin;
