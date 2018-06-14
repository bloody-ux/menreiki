import React, { Component } from 'react';
import LazyRouteLoader from '../core/LazyRouteLoader';
import routes, { ErrorView, onRouteChanged, onError } from './routes';

class App extends Component {
  state = {
  }
  render() {
    return (
      <LazyRouteLoader
        routes={routes}
        ErrorView={ErrorView}
        onRouteChanged={onRouteChanged}
        onError={onError}
      />
    );
  }
}

export default App;
