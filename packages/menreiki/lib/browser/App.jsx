import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LazyRouteLoader from '../core/LazyRouteLoader';

class App extends Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  componentDidMount() {
    console.log('xx');
  }

  render() {
    return (
      <LazyRouteLoader
        routes={this.props.routes}
      />
    );
  }
}

export default App;
