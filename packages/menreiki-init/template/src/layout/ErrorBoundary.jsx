import React, { Component } from 'menreiki/react';
import { PropTypes } from 'menreiki';

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logError(error);
    console.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <h2>
          Oops, something goes wrong
        </h2>
      );
    }

    return children;
  }
}
