import { runInjectRoute } from './common';

const routes = require(ROUTESPATH);

export default runInjectRoute(
  routes.default || routes,
);
