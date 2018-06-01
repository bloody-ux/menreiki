import { runInjectRoute } from './common';
import DefaultErrorView from './DefaultErrorView';
import { noop } from './index';

const routes = require(ROUTESPATH);

export default runInjectRoute(
  routes.default || routes,
);

export const ErrorView = routes.ErrorView || DefaultErrorView;

export const routeChanged = typeof routes.routeChanged === 'function' ?
  routes.routeChanged :
  noop;
