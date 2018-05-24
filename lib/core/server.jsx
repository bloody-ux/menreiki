import React from 'react';
import { create } from 'dva-core';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import serialize from 'serialize-javascript';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import colors from 'colors';
import App from './App';
import config from './config';

function logKV(key, value) {
  console.log(colors.magenta(key), value);
}

export function getRequestPath(req) {
  return req.path || req._parsedUrl.pathname;
}

export function createApp(onError) {
  const app = create({
    onError,
  });
  app.start();

  return app;
}

export function updateOrigin(req) {
  // for server side rendering, relative url doesn't work
  // added setup to concat orgin with url
  if (!config.origin) {
    config.origin = `${req.protocol}://${req.headers.host}`;
  }
}

export function httpHandler(req, res, app, webpackResult, pageName) {
  const context = {
    __INITIAL_DATA__: {
      data: app._store.getState(),
    },
  };
  const markup = renderToString(
    <Provider store={app._store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>,
  );

  // 如果碰到Redirect 组件
  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    return res.end();
  }

  const chunkNames = flushChunkNames();
  const {
    js,
    styles,
    cssHash,
    scripts,
    stylesheets,
  } = flushChunks(webpackResult.clientStats, {
    chunkNames,
    before: ['manifest'],
  });

  console.log();
  logKV('PATH: ', colors.green(req.url));
  logKV('  DYNAMIC CHUNK NAMES RENDERED:   ', chunkNames);
  logKV('  SCRIPTS SERVED:                 ', scripts);
  logKV('  STYLESHEETS SERVED:             ', stylesheets);
  console.log();

  return res.end(config.template({
    pageName,
    styles,
    cssHash,
    js,
    initalState: serialize(context.__INITIAL_DATA__),
    elementId: config.hostElement.substr(1),
    markup,
  }));
}
