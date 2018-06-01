import routes from './routes';
import { getFinalizedRoutes } from './common';

/**
 * util to load async component
 */
export { default as async } from './async';

/**
 * used to redirect to another route in routes config
 */
export { default as redirect } from './redirect';

/**
 * isomorphic-fetch pacakge
 */
export { default as fetch } from 'isomorphic-fetch';

/**
 * convert relative url to absolute url
 */
export { normalizeUrl } from './fetch';

/**
 * function doesn't do anthing
 */
export function noop() {}

/**
 * get all matching routes for specific url
 * @param {string} path current path, can use router's location.path
 */
export function getMatchedRoutes(path) {
  return getFinalizedRoutes(routes, path);
}
