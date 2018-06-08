import { create } from 'dva-core';
import invariant from 'invariant';
import routes from './routes';
import { noop } from './index';
import { getFinalizedRoutes, updateStore } from '../core/common';

// single instance
let app = null;

function createApp() {
  if (app) return app;

  app = create({
    onError: noop, // used to capture dispatching error throw with Promise.reject, or else double error will be thown
    initialState:
    window.__INITIAL_DATA__ &&
    window.__INITIAL_DATA__.data,
  });

  app.ssr = !!window.__INITIAL_DATA__;

  // delete after creating, to release memory
  delete window.__INITIAL_DATA__;
  // don't start before add model to it
  return app;
}

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


export async function bootstrap() {
  createApp();
  // money before start
  monkeyPatchModel();

  const path = window.location.pathname;
  const finalizedRoutes = await getFinalizedRoutes(routes, path);
  await updateStore(finalizedRoutes, app, false); // needn't do dispatch for first rendering

  app.start();

  // after start, model method will be override by dva, need money path again
  monkeyPatchModel();

  return app._store;
}

export function getApp() {
  invariant(app, 'app does\'nt exist, please use createApp to create one');
  return app;
}
