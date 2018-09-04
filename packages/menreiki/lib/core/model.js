import { create } from 'dva-core/src';
import { matchRoutes } from 'react-router-config';
import { onDvaError } from './config';
import createLoading from './dva-loading';
import { loadAsync } from './lifecycle';

// single instance
let app = null;

function createApp() {
  if (app) return app;

  app = create({
    onError: onDvaError, // used to capture dispatching error throw with Promise.reject, or else double error will be thown
    initialState:
    window.__INITIAL_DATA__ &&
    window.__INITIAL_DATA__.data,
  });

  app.use(createLoading());

  // delete after creating, to release memory
  delete window.__INITIAL_DATA__;
  // don't start before add model to it
  return app;
}

// 用于避免多次app.model导致dva错误的问题
function monkeyPatchModel() {
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

function processDupDvaError() {
  const { dispatch } = app._store;
  app._store.dispatch = function dispatchWithCatchUnhandledRejection(...args) {
    const result = dispatch.apply(app._store, args);

    // is effect, auto catch unhandled promise, but print to console
    if (result && result.catch) {
      result.catch((err) => {
        console.error(err);
      });
    }

    return result;
  };
}

export async function bootstrap(routes) {
  createApp();
  app.start();

  // after start, model method will be override by dva, need money path again
  monkeyPatchModel();

  // 自动捕捉dva二次抛出的unhandled rejection
  processDupDvaError();

  // 加载首次的route和model，避免出现connect出错
  const path = window.location.pathname;
  const matchedRoutes = matchRoutes(routes, path);

  await loadAsync(routes, path, matchedRoutes, {
    isFirstRender: true,
  });

  return app._store;
}

export function getApp() {
  return app;
}
