import React, { createContext, Component } from 'react';
import { pick, get } from 'lodash';

import client from '../apollo/';
import { QUERY_REPOS } from '../apollo/gql';

const cx = createContext({});
class Provider extends Component {
  defaultValues = {
    isLoading: false,
    keyword: '',
    repos: [],
    nextPage: 1,
    perPage: 10
  };

  constructor(props) {
    super(props);
    this.fetchPromise = null;
    this.state = {
      ...this.defaultValues,
      actions: {
        setKeyword: this.setKeyword,
        setLoadingState: this.setLoadingState,
        searchRepos: this.searchRepos,
        fetchMore: this.fetchMore,
        addRepos: this.addRepos,
        resetRepos: this.resetRepos
      }
    };
  }

  _setStateAsync = nextState => {
    return new Promise(resolve => this.setState(nextState, () => resolve()));
  };

  setKeyword = keyword => {
    return this._setStateAsync(_ => ({ keyword }));
  };

  setLoadingState = (isLoading = false) => this._setStateAsync({ isLoading });

  searchRepos = async () => {
    await this.resetRepos(['repos', 'nextPage', 'perPage']);
    await this.fetchMore();
  };

  fetchMore = async () => {
    const { keyword, nextPage, perPage } = this.state;
    await this.setLoadingState(true);
    try {
      const { data } = await client.query({
        query: QUERY_REPOS,
        variables: {
          keyword,
          perPage,
          page: nextPage,
        }
      });
      await Promise.all([
        this._setStateAsync(prev => ({ nextPage: prev.nextPage + 1 })),
        this.addRepos(get(data, ['searchRepos', 'items']))
      ]);
    } finally {
      await this.setLoadingState(false);
    }
  };

  addRepos = repos => {
    if (!repos) return;
    return this._setStateAsync(prev => ({ repos: prev.repos.concat(repos) }));
  };

  resetRepos = (fields = []) => {
    return this._setStateAsync(
      _ =>
        fields.length === 0
          ? this.defaultValues
          : pick(this.defaultValues, fields)
    );
  };

  render() {
    return <cx.Provider value={this.state}>{this.props.children}</cx.Provider>;
  }
}

export default {
  Provider: Provider,
  Consumer: cx.Consumer
};
