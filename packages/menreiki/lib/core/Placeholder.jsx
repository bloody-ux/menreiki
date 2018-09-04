import { PropTypes } from 'prop-types';

/**
 * empty component for routes to work, just to simply routes configuration
 */
export default function Placeholder({ children }) {
  return children;
}

Placeholder.displayName = 'menreiki-placeholder';

Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
};
