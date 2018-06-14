/**
 * used to distatch action before rendering route after route change
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { withRouter, Route } from 'react-router-dom';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { getApp } from './client';
import { getFinalizedRoutes, updateStore, getPageName } from './common';

function isRedirectMatch(pathname) {
  const matchedRoutes = matchRoutes(pathname);
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
    ErrorView: PropTypes.func.isRequired,
    // onError: PropTypes.func.isRequired,
    // onRouteChanged: PropTypes.func.isRequired,
  }

  state = {
    previousLocation: null,
    error: null,
  }

  componentDidMount() {
    const app = getApp();
    // if ssr, server already fill the scripts and with initalState
    if (app.ssr) return;

    this.load(this.props, null);
  }

  async componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    if (!navigated) return;

    // if current match is a redirect component
    if (isRedirectMatch(nextProps.location.pathname)) return;

    this.setState({
      previousLocation: this.props.location,
    });

    await this.load(nextProps, this.props);

    this.setState({
      previousLocation: null,
    });
  }

  componentDidCatch(error) {
    this.setState({
      error,
    });
  }

  async load(props, prevProps) {
    NProgress.start();

    const path = props.location.pathname;
    const { onRouteChanged } = props;
    let error = null;
    let finalizedRoutes = null;

    try {
      finalizedRoutes = await getFinalizedRoutes(props.routes, path);
      NProgress.set(0.4); // set to 40% after loading codebase
      await updateStore(finalizedRoutes, getApp());
      NProgress.set(0.8); // set to 80% after dispatching action

      this.tryUpdatedPageMeta(finalizedRoutes);

      await onRouteChanged(finalizedRoutes, props, prevProps);
    } catch (ex) {
      const { onError } = props;
      const result = onError(error, finalizedRoutes, props, prevProps);
      // if onError returns false, means prevent default error handling
      if (result !== false) {
        error = ex;
        console.error(ex);
      }
    }

    NProgress.done();

    // to remove useless update
    if (this.state.error !== error) {
      this.setState({
        error,
      });
    }
  }

  tryUpdatedPageMeta(finalizedRoutes) {
    let pageNameMeta = document.querySelector('meta[name=pagename]');
    if (!pageNameMeta) {
      pageNameMeta = document.createElement('meta');
      pageNameMeta.name = 'pagename';
      document.querySelector('head').appendChild(pageNameMeta);
    }

    let title = document.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      document.querySelector('head').appendChild(title);
    }

    pageNameMeta.content = getPageName(finalizedRoutes);
    title.textContent = pageNameMeta.content;
  }

  render() {
    const { location, routes, ErrorView } = this.props;
    const { previousLocation, error } = this.state;

    if (error) return <ErrorView error={error} />;

    return (
      <Route
        location={previousLocation || location}
        render={() => renderRoutes(routes)}
      />
    );
  }
}

export default withRouter(LazyRouteLoader);
