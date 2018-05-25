export routes from './src/routes';

export const hostElement = '#app';

export const template = function({
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
