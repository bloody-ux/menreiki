const menreikiConfig = require(MENREIKICONFIG);

export default {
  origin: '',
  proxy: true,
  hostElement: '#app',
  template({
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
          <title>Template Page</title>
          ${styles}
          <script>window.__INITIAL_DATA__ = ${initalState}</script>
        </head>

        <body>
          <div id="${elementId}">${markup}</div>
        </body>
        ${cssHash}
        ${js}
    `;
  },
  ...menreikiConfig,
};
