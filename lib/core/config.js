const menreikiConfig = require(MENREIKICONFIG);

export default {
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
          <link rel="icon" href="https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico" type="image/x-icon" />
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
