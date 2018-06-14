import { runInjectRoute } from './common';
import DefaultErrorView from './DefaultErrorView';
import { noop } from './index';

const routes = require(ROUTESPATH);

export default runInjectRoute(
  routes.default || routes,
);

export const ErrorView = routes.ErrorView || DefaultErrorView;

export const onRouteChanged = typeof routes.onRouteChanged === 'function' ?
  routes.onRouteChanged :
  noop;

export const onError = typeof routes.onError === 'function' ?
  routes.onError :
  noop;
