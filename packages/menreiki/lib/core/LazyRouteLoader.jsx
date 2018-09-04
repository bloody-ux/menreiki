/**
 * used to distatch action before rendering route after route change
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { withRouter, Route } from 'react-router-dom';
import { loadAsync, handleError, routeChanged } from './lifecycle';

function isRedirectMatch(matchedRoutes) {
  if (matchedRoutes && matchedRoutes.length > 0) {
    const lastRoute = matchedRoutes[matchedRoutes.length - 1];

    let { component } = lastRoute.route;
    while (component) {
      if (component.isRedirectWrapper) {
        return true;
      }

      component = component.WrappedComponent;
    }
  }

  return false;
}

class LazyRouteLoader extends Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      component: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
      ]).isRequired,
      exact: PropTypes.bool,
    })).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }

  state = {
    previousLocation: null,
  }

  async componentWillReceiveProps(nextProps) {
    if (!routeChanged(nextProps.location, this.props.location)) return;

    const { routes, location } = nextProps;
    const path = location.pathname;

    const matchedRoutes =
      matchRoutes(routes, path);
    // if current match is a redirect component
    if (isRedirectMatch(matchedRoutes)) return;

    // just set value, don't use async this.setState,
    // or else, shouldComponentUpdate can't get the correct previousLocation
    this.state.previousLocation = this.props.location;

    // load chunks and services
    await loadAsync(routes, path, matchedRoutes, {
      isFirstRender: false,
      props: nextProps,
      prevProps: this.props,
    });

    // after loading chunks and calling services, force a update
    this.state.previousLocation = null;
    this.forceUpdate();
  }

  shouldComponentUpdate() {
    // to prevent useless render, if previousLocation is set, hold on.
    if (this.state.previousLocation) return false;

    return true;
  }

  componentDidCatch(error, info) {
    handleError(error, info);
  }

  render() {
    const { location, routes } = this.props;
    const { previousLocation } = this.state;

    return (
      <Route
        location={previousLocation || location}
        render={() => renderRoutes(routes)}
      />
    );
  }
}

export default withRouter(LazyRouteLoader);
