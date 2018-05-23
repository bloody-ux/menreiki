import React, { Component } from 'react';
import LazyRouteLoader from '../core/LazyRouteLoader';
import routes from './routes';

class App extends Component {
  state = {
  }
  render() {
    return (
      <LazyRouteLoader routes={routes} />
    );
  }
}

export default App;
