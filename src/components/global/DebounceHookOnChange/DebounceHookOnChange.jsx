import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEqual, noop, debounce, pick } from 'lodash';

class DebounceHookOnChange extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    /** origin onChange prop to pass into children */
    onChange: PropTypes.func,
    /** a debounced hook function that will be invoked when onChange is called */
    onDebounceChange: PropTypes.func,
    /** debounce time */
    wait: PropTypes.number,
    /** same as debounce of lodash */
    options: PropTypes.shape({
      leading: PropTypes.bool,
      maxWait: PropTypes.number,
      trailing: PropTypes.bool
    })
  };

  static defaultProps = {
    onChange: noop,
    onDebounceChange: noop,
    wait: 0,
    options: {}
  };

  constructor(props) {
    super(props);
    const { onDebounceChange, wait, options } = props;
    this.onDebounceChange = this.getDebouncedFunc();
    this.state = {
      hasToReCreateDebounceFunc: false,
      last: {
        wait,
        options,
        onDebounceChange
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    const current = pick(props, ['wait', 'options', 'onDebounceChange']);
    if (!isEqual(current, state.last)) {
      return {
        hasToReCreateDebounceFunc: true,
        last: current
      };
    }
    return {
      hasToReCreateDebounceFunc: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasToReCreateDebounceFunc) {
      this.onDebounceChange = this.getDebouncedFunc();
    }
  }

  componentWillUnmount() {
    this.onDebounceChange = null;
  }

  getDebouncedFunc = () => {
    const { onDebounceChange, wait, options } = this.props;
    return debounce(onDebounceChange, wait, options).bind(this);
  };

  handleChange = (...args) => {
    const { onChange } = this.props;
    if (isFunction(onChange)) onChange(...args);
    if (isFunction(this.onDebounceChange)) this.onDebounceChange(...args);
  };

  render() {
    const { children } = this.props;
    return isFunction(children)
      ? children(this.handleChange)
      : React.Children.only(
          React.cloneElement(children, { onChange: this.handleChange })
        );
  }
}

export default DebounceHookOnChange;
