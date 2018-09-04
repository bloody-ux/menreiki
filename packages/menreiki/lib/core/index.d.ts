import { matchRoutes, MatchedRoute } from 'react-router-config';
import { getMetaFromMatchedRoutes } from './common';
import { logError, ErrorCode } from './clue';

/**
 * clue
 */
export const clue = {
  logError,
  ErrorCode,
};

/**
 * util to load async component
 */
export { default as async } from './async';

/**
 * used to redirect to another route in routes config
 */
export { default as redirect } from './redirect';

/**
 * function doesn't do anthing
 */
export function noop() {}

/**
 * convert relative url to absolute url
 */
export { default as fetch } from './fetch';


/**
 * get all matching routes for specific url
 * @param {string} path current path, can use router's location.pathname, or match.url
 */
export function getMatchedRoutes(path: string) {
  const routes = require('./routes');
  return matchRoutes(routes.default, path);
}

/**
 * get metadata from routes, search from leaf to root
 * @param {Array<MatchedRoute>} matchedRoutes current matched routes array
 * @param {(route: Route) => any} filter filter function to get meta
 */
export function getMatchedRoutesMeta(matchedRoutes: Array<MatchedRoute>, filter: (route: MatchedRoute) => any) {
  return getMetaFromMatchedRoutes(matchedRoutes, filter);
}

export { connect } from 'react-redux';
export { default as PropTypes } from 'prop-types';
export { default as hoistStatics } from 'hoist-non-react-statics';
export { default as invariant } from 'invariant';
export { default as warning } from 'warning';
export { default as parseUrl } from 'url-parse';
