import React, { Component } from 'menreiki/react';
import { PropTypes } from 'menreiki';
import './Async.less';

class Async extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  state = {

  }

  render() {
    const { title } = this.props;

    return (
      <div className="async-page">
        Async Component + {title}
      </div>
    );
  }
}

export default Async;
