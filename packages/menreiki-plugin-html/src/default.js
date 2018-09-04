module.exports = {
  template(
    styles,
    js,
    elementId,
    optional
  ) {
    const { charset, title, icon, cmsParseStatement, publicPath } = optional;
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="${charset}">
    <meta name="pagename" content="${title}">
    <link rel="icon" href="${icon}" type="image/x-icon" />
    <link rel="shortcut icon" href="${icon}" type="image/x-icon" />
    <title>${title}</title>
    ${cmsParseStatement}
    <script>
      window.__webpack_public_path__ = '${publicPath}/';
    </script>
    ${styles.join('\n    ')}
  </head>
  <body>
    <!--[if lt IE 10]>
      <script src="https://gw.alipayobjects.com/os/lib/classlist/2014-07-23/classList.min.js"></script>
      <script src="https://gw.alipayobjects.com/os/rmsportal/JOxClGTWpZIyNRjdDEbL.js"></script>
      <script>
        window.raf.polyfill();
      </script>
      <![endif]-->
    <div id="${elementId.substring(1)}"></div>
    ${js.join('\n    ')}
  </body>
</html>
    `;
  },
};
