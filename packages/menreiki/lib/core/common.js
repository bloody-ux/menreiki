import { matchRoutes } from 'react-router-config';
import invariant from 'invariant';
import warning from 'warning';

import injectRoute from './injectRoute';
import Placeholder from './Placeholder';

export function getComponentName(Component) {
  return Component.displayName || Component.name;
}

export function getFinalizedRoutes(routes, path) {
  warning(Array.isArray(routes) && routes.length, '`routes` is not an array or the length is 0');
  const matchedRoutes = matchRoutes(routes, path);

  const finalizedRoutes = matchedRoutes.map(({ match, route }) => {
    invariant(route.component, 'missing `component` property in route config');
    // if it's an async component, load it before return
    const { preload } = route.component;

    if (preload) {
      return preload().then(component => ({
        component: injectRoute(component.default || component), // fixed async route doesn't get polyfill issue
        match,
        route,
      }));
    }

    return Promise.resolve(({
      component: route.component,
      match,
      route,
    }));
  });

  // return an array in route parent -> child order
  return Promise.all(finalizedRoutes);
}

export function getMetaFromMatchedRoutes(matchedRoutes, filter) {
  const routeLength = matchedRoutes.length;
  warning(
    routeLength,
    'no route is matching, please confirm whether fallback route is configured',
  );

  return matchedRoutes
    .reverse()
    .reduce((memo, { route }) => {
      if (memo) return memo;
      if (filter(route)) return filter(route);

      return null;
    }, null);
}

export function getPageName(matchedRoutes) {
  return getMetaFromMatchedRoutes(matchedRoutes, route => route.title);
}

export function updateStore(finializedRoutes, app, needDispatch = true) {
  // add models to store before do dispatching
  finializedRoutes.forEach(({ component, match }) => {
    const { preInit } = component;

    const params = {
      ...match,
      matchedRoutes: finializedRoutes,
      store: app._store,
      app,
    };
    preInit && preInit(params);
  });

  if (!needDispatch) return Promise.resolve([]);

  // do dispatching for store
  const effects = finializedRoutes
    .filter(({ component }) => component.init)
    .map(async({ component, match, route }) => {
      const { init } = component;

      const params = {
        ...match,
        matchedRoutes: finializedRoutes,
        store: app._store,
        app,
      };

      const result = await init(params);
      route._dataContext = result;

      return result;
    });


  return Promise.all(effects);
}

function joinPath(path1, path2) {
  let result = path1 + path2;
  // 替换 // 为 /
  result = result.replace(/\/\//g, '/');

  return result;
}

function injectRouteInternal(route, parentPath) {
  // if no component is used, just add a place holder component
  if (!route.component) {
    route.component = Placeholder;
  }

  route.component = injectRoute(route.component);

  // if there's path in route and not root path
  if (route.path && parentPath) {
    route.path = joinPath(parentPath, route.path);
  }

  if (Array.isArray(route.routes)) {
    route.routes.forEach(
      childRoute => injectRouteInternal(childRoute, route.path),
    );
  }
}

export function runInjectRoute(routes) {
  warning(Array.isArray(routes) && routes.length, '`routes` is not an array or the length is 0');
  routes.forEach(route => injectRouteInternal(route));

  return routes;
}
