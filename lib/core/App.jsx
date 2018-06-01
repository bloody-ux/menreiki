import React, { Component } from 'react';
import LazyRouteLoader from '../core/LazyRouteLoader';
import routes, { ErrorView, routeChanged } from './routes';

class App extends Component {
  state = {
  }
  render() {
    return (
      <LazyRouteLoader
        routes={routes}
        ErrorView={ErrorView}
        routeChanged={routeChanged}
      />
    );
  }
}

export default App;
