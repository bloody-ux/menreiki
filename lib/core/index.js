import { matchRoutes } from 'react-router-config';
import routes from './routes';

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
 * @param {string} path current path, can use router's location.pathname
 */
export function getMatchedRoutes(path) {
  return matchRoutes(routes, path);
}

export { connect } from 'react-redux';
export { PropTypes } from 'prop-types';
export { default as hoistStatics } from 'hoist-non-react-statics';
export { default as invariant } from 'invariant';
export { default as warning } from 'warning';
