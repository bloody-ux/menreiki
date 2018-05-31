## how to use 

``` bash
npm install -g menreiki
menreiki init
```

## todo

add more docs

## default menreiki.config.js

``` javascript

// commonjs module

// whether mock server is enabled
exports.proxy = undefined;

// babel config for client side
exports.babel = function(babelConfig) {
  return babelConfig;
};

// babel config for server side
exports.babelServer = function(babelConfig) {
  return babelConfig;
};

// webpack config for client side
exports.webpack = function(webpackConfig) {
  return webpackConfig;
};

// webpack config for server side
exports.webpackServer = function(webpackConfig) {
  return webpackConfig;
};

exports.template = function({
  pageName,
  styles,
  cssHash,
  js,
  initalState,
  elementId,
  markup,
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="pagename" content="${pageName}">
        <link rel="icon" href="https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico" type="image/x-icon" />
        <title>${pageName}</title>
        ${styles}
        <script>window.__INITIAL_DATA__ = ${initalState}</script>
      </head>
      <body>
        <div id="${elementId}">${markup}</div>
      </body>
      ${cssHash}
      ${js}
  `;
};

```