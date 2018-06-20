import { matchRoutes } from 'react-router-config';
import routes from './routes';
import { Route } from 'react-router-dom';

/**
 * util to load async component
 */
export { default as async } from './async';

/**
 * used to redirect to another route in routes config
 */
export { default as redirect } from './redirect';

/**
 * convert relative url to absolute url
 */
export { default as fetch } from './fetch';

/**
 * function doesn't do anthing
 */
export function noop() {}

/**
 * get all matching routes for specific url
 * @param {string} path current path, can use router's location.pathname, or match.url
 */
export function getMatchedRoutes(path: string) {
  return matchRoutes(routes, path);
}

/**
 * get metadata from routes, search from leaf to root
 * @param {string} path current path, can use router's location.pathname, or match.url
 * @param {(route: Route) => any} filter filter function to get meta
 */
export function getMatchedRoutesMeta(path: string, filter: (route: Route) => any) {
  const matchedRoutes = getMatchedRoutes(path);
  return getMetaFromMatchedRoutes(matchedRoutes, filter);
}

export { connect } from 'react-redux';
export { default as PropTypes } from 'prop-types';
export { default as hoistStatics } from 'hoist-non-react-statics';
export { default as invariant } from 'invariant';
export { default as warning } from 'warning';
export { default as parseUrl } from 'url-parse';
