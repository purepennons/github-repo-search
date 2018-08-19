import React, { Component } from 'react';

import Context from './context/';
import App from './layout/App';

import 'normalize.css';

const { ContextProvider } = Context;

class Root extends Component {
  render() {
    return (
      <ContextProvider>
        <App />
      </ContextProvider>
    );
  }
}

export default Root;
