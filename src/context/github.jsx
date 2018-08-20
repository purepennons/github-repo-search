import React, { createContext, Component } from 'react';
import { pick, get, isFinite, noop } from 'lodash';
import Bottleneck from 'bottleneck';
import PCancelable from 'p-cancelable';

import client from '../apollo/';
import { QUERY_REPOS } from '../apollo/gql';
import { NOT_FOUND_ERROR } from '../constants/error';

const cx = createContext({});

const limiter = new Bottleneck(1, 6000);

const req = args => {
  return new PCancelable((resolve, reject, onCancel) => {
    onCancel(noop);

    return limiter
      .schedule(() => client.query(args))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

class Provider extends Component {
  defaultValues = {
    isLoading: false,
    keyword: '',
    repos: [],
    nextPage: 1,
    perPage: 10,
    error: null
  };

  constructor(props) {
    super(props);
    this.fetchPromiseQueue = [];
    this.state = {
      ...this.defaultValues,
      actions: {
        setKeyword: this.setKeyword,
        setLoadingState: this.setLoadingState,
        setPerPage: this.setPerPage,
        setError: this.setError,
        searchRepos: this.searchRepos,
        fetchMore: this.fetchMore,
        addRepos: this.addRepos,
        resetRepos: this.resetRepos
      }
    };
  }

  componentWillUnmount() {
    this._cancelPrevFetchTasks();
  }

  _setStateAsync = nextState => {
    return new Promise(resolve => this.setState(nextState, () => resolve()));
  };

  _cancelPrevFetchTasks = () => {
    while (this.fetchPromiseQueue.length > 0) {
      const p = this.fetchPromiseQueue.shift();
      if (p) p.cancel('cacnel search task');
    }
  };

  setKeyword = keyword => {
    return this._setStateAsync(_ => ({ keyword }));
  };

  setLoadingState = (isLoading = false) => this._setStateAsync({ isLoading });

  setPerPage = (perPage = this.defaultValues.perPage) => {
    return this._setStateAsync(prev => ({
      perPage: isFinite(perPage) ? parseInt(perPage, 10) : prev.perPage
    }));
  };

  setError = ({ desc, code, obj }) => {
    return this._setStateAsync({ error: { desc, code, obj } });
  };

  searchRepos = async () => {
    this._cancelPrevFetchTasks();
    await this.resetRepos(['repos', 'nextPage', 'error']);
    await this.fetchMore();
  };

  fetchMore = async () => {
    const { keyword, nextPage, perPage } = this.state;
    await this.resetRepos(['error']);

    if (!keyword) return;

    await this.setLoadingState(true);

    let fetchPromise = null;
    try {
      fetchPromise = req({
        query: QUERY_REPOS,
        variables: {
          keyword,
          perPage,
          page: nextPage
        }
      });
      this.fetchPromiseQueue.push(fetchPromise);

      const { data } = await fetchPromise;
      const repos = get(data, ['searchRepos', 'items']);
      if (!repos || repos.length < 1) throw NOT_FOUND_ERROR;

      await Promise.all([
        this._setStateAsync(prev => ({ nextPage: prev.nextPage + 1 })),
        this.addRepos(repos)
      ]);
    } catch (error) {
      if (fetchPromise && fetchPromise.isCanceled) return;

      this.setError({
        desc: error.desc,
        code: error.code,
        obj: error
      });
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
