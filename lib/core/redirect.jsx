import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

export default function redirect({ to, push, exact, strict, from }) {
  return class RedirectWrapper extends Component {
    static displayName = `redirect(${from || ''}) => ${to}`

    static propTypes = {
      location: PropTypes.shape({
      }).isRequired,
    }

    shouldComponentUpdate(nextProps) {
      // fixed redirect will update when lazyroute dispatching an action in previous location
      return nextProps.location !== this.props.location;
    }

    render() {
      return (
        <Redirect
          from={from}
          to={to}
          push={push}
          exact={exact}
          strict={strict}
        />
      );
    }
  };
}
