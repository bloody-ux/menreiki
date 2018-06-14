import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import hoistStatics from 'hoist-non-react-statics';

import { getComponentName } from './common';

/**
 * A public higher-order component to convert renderRoutes call to children prop
 */
const injectRoute = (Component) => {
  const InjectRouteWrapper = (props) => {
    const { wrappedComponentRef, route, ...remainingProps } = props;

    return (
      <Component
        {...remainingProps}
        ref={wrappedComponentRef}
        route={route}
      >
        {renderRoutes(route.routes)}
      </Component>
    );
  };

  InjectRouteWrapper.displayName = `injectRoute(${getComponentName(Component)})`;
  InjectRouteWrapper.WrappedComponent = Component;
  InjectRouteWrapper.propTypes = {
    wrappedComponentRef: PropTypes.func,
    route: PropTypes.shape({
      routes: PropTypes.array,
    }),
  };

  InjectRouteWrapper.defaultProps = {
    wrappedComponentRef: undefined,
    route: undefined,
  };

  return hoistStatics(InjectRouteWrapper, Component);
};

export default injectRoute;
