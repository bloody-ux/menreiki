/**
 * used to distatch action before rendering route after route change
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { withRouter, Route } from 'react-router-dom';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { getApp } from './client';
import { getFinalizedRoutes, updateStore, getPageName } from './common';

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
    hasError: false,
  }

  componentDidMount() {
    const app = getApp();
    // if ssr, server already fill the scripts and with initalState
    if (app.ssr) return;

    this.load(this.props);
  }

  async componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    if (!navigated) return;

    this.setState({
      previousLocation: this.props.location,
    });

    await this.load(nextProps);

    this.setState({
      previousLocation: null,
    });
  }


  async load(props) {
    NProgress.start();

    const path = props.location.pathname;
    let hasError = false;

    try {
      const finalizedRoutes = await getFinalizedRoutes(props.routes, path);
      NProgress.set(0.4); // set to 40% after loading codebase
      await updateStore(finalizedRoutes, getApp());
      NProgress.set(0.8); // set to 80% after dispatching action

      this.tryUpdatedPageMeta(finalizedRoutes);
    } catch (ex) {
      hasError = true;
      console.error(ex);
    }

    NProgress.done();

    this.setState({
      hasError,
    });
  }

  tryUpdatedPageMeta(finalizedRoutes) {
    let pageNameMeta = document.querySelector('meta[name=pagename]');
    if (!pageNameMeta) {
      pageNameMeta = document.createElement('meta');
      pageNameMeta.name = 'pagename';
      document.querySelector('head').appendChild(pageNameMeta);
    }

    pageNameMeta.content = getPageName(finalizedRoutes);
  }

  render() {
    const { location, routes } = this.props;
    const { previousLocation, hasError } = this.state;

    // TODO: enhance error page
    if (hasError) return <p>出错了</p>;

    return (
      <Route
        location={previousLocation || location}
        render={() => renderRoutes(routes)}
      />
    );
  }
}

export default withRouter(LazyRouteLoader);
