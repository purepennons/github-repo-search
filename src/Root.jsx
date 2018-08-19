import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import Context from './context/';
import App from './layout/App';

import 'normalize.css';
import './Root.style.js';

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

export default hot(module)(Root);
