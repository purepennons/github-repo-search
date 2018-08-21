import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, noop } from 'lodash';

import { callAsync } from '../../lib/utlis';

class InfiniteScroll extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    onFetchMore: PropTypes.func,
    fetchArgs: PropTypes.array
  };

  static defaultProps = {
    style: {},
    className: '',
    onFetchMore: noop,
    fetchArgs: []
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      error: null
    };
  }

  handleScroll = event => {
    const target = event.target;
    const { onFetchMore, fetchArgs } = this.props;
    if (this.state.isLoading) return;
    if (target.clientHeight + target.scrollTop >= target.scrollHeight) {
      this.setState(
        _ => ({ isLoading: true, data: null, error: null }),
        () => {
          return callAsync(onFetchMore, ...fetchArgs)
            .then(data => this.setState(_ => ({ data, isLoading: false })))
            .catch(error => this.setState(_ => ({ error, isLoading: false })));
        }
      );
    }
  };

  render() {
    const { children, className, style } = this.props;
    return (
      <div className={className} style={style} onScroll={this.handleScroll}>
        {isFunction(children)
          ? children(this.state)
          : React.children.only(
              React.cloneElement(children, { ...this.state })
            )}
      </div>
    );
  }
}

export default InfiniteScroll;
