import React from 'react';
import PropTypes from 'prop-types';

export default function DefaultErrorView({ error }) {
  return (
    <div>
      <h1>Oops</h1>
      <p>Error happened:</p>
      <p>{error.message}</p>
      <code>{error.stack}</code>
    </div>
  );
}

DefaultErrorView.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    stack: PropTypes.string,
  }).isRequired,
};

