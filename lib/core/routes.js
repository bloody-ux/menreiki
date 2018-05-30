import { runInjectRoute } from './common';

export default runInjectRoute(
  require(ROUTESPATH).default || require(ROUTESPATH),
);
