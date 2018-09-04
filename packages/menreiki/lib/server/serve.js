const fs = require('fs');
const url = require('url');
const plugin = require('./plugin');
const ocConfig = require('./config');

function defaultRender({
  styles,
  js,
  publicPath,
  elementId,
}) {
  const cssLink = styles.map(style => `<link rel="stylesheet" href="${publicPath}/${style}" />`).join('\n');
  const jsScript = js.map(script => `<script crossorigin type="text/javascript" src="${publicPath}/${script}" defer></script>`).join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="pagename" content="">
        <link rel="icon" href="https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico" type="image/x-icon" />
        <title>首页</title>
        <script>
          window.__webpack_public_path__ = '/';
        </script>
        ${cssLink}
      </head>

      <body>
        <div id="${elementId}"></div>
        ${jsScript}
      </body>
    </html>
  `;
}

function getHtml(webpackResult, isDevServer) {
  const stats = webpackResult.compilation.getStats().toJson();
  const publicPath = stats.publicPath.replace(/\/$/, '');

  const render = plugin.run(plugin.stages.build).render || defaultRender;

  // dynamic get main entry resources
  const initalAssets = stats.entrypoints.main.assets;
  const styles = initalAssets.filter(asset => /.css$/.test(asset));
  const js = initalAssets.filter(asset => /.js$/.test(asset));

  return render({
    styles, // for dev server, mini-css-text-plugin doesn't support hmr, so use style-loader
    js,
    elementId: ocConfig.elementId,
    publicPath,
    isDevServer
  }).trim();
}

exports.httpHandler = webpackResult => (function(req, res, next) {
  const parsedUrl = url.parse(req.url);
  // .json request won't be proceeded by html handler
  if (/\.json$/.test(parsedUrl.pathname)) {
    return next();
  }

  return res.end(getHtml(webpackResult, true));
});

exports.createIndex = (webpackResult, distPath) => {
  const vm = getHtml(webpackResult);
  fs.writeFileSync(`${distPath}/index.vm`, vm);
};
