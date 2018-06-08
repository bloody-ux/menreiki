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

function monkeyPatchModel(app) {
  // monkey patch model method for client after dva.start()
  // when started, model method will change to injectModel
  const oldModel = app.model;
  app.model = function(m) {
    const models = app._models;
    const { length } = models;
    for (let i = 0; i < length; i++) {
      if (models[i].namespace === m.namespace) {
        return models[i];
      }
    }

    return oldModel.call(app, m);
  };
}

export function getRequestPath(req) {
  return req.path || req._parsedUrl.pathname;
}

export function createApp(onError) {
  const app = create({
    onError,
  });
  app.start();
  monkeyPatchModel(app);

  return app;
}

export function ssrHandler(req, res, app, webpackResult, pageName) {
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
    url: req.url,
    js,
    initalState: serialize(context.__INITIAL_DATA__),
    elementId: 'app',
    markup,
  }));
}

export function httpHandler(req, res, app, webpackResult, pageName) {
  const chunkNames = flushChunkNames();
  const {
    js,
    styles,
    cssHash,
  } = flushChunks(webpackResult.clientStats, {
    chunkNames,
    before: ['manifest'],
  });

  return res.end(config.template({
    pageName,
    styles,
    cssHash,
    url: req.url,
    js,
    initalState: '""',
    elementId: 'app',
    markup: '',
  }));
}
