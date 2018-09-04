import React, { Component } from 'menreiki/react';
import { Page } from '@alife/frog';
import { clue, PropTypes } from 'menreiki';

const { logError } = clue;

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
    logError(error);
    console.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Page.Error
          title="系统异常"
          description="请尽快联系客服解决问题"
        />
      );
    }

    return children;
  }
}
