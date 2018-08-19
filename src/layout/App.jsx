import React, { Component } from 'react';

import Context from '../context/';
import DebounceHookOnChange from '../components/global/DebounceHookOnChange/DebounceHookOnChange';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';

const { withContextConsumer } = Context;

class App extends Component {
  handleChange = event => {
    const {
      github: { actions }
    } = this.props;
    const input = event.target.value;
    actions.setKeyword(input);
  };

  handleDebounceChange = () => {
    const {
      github: { actions }
    } = this.props;
    actions.searchRepos();
  };

  render() {
    const {
      github: { actions, repos }
    } = this.props;
    return (
      <div>
        <header>
          <DebounceHookOnChange
            wait={500}
            onChange={this.handleChange}
            onDebounceChange={this.handleDebounceChange}
          >
            {onChange => <input type="text" onChange={onChange} />}
          </DebounceHookOnChange>
        </header>
        <main>
          <InfiniteScroll onFetchMore={actions.fetchMore} style={{overflow: 'auto', height: '200px'}}>
            {({ isLoading }) => {
              return (
                <ul>
                  {repos.map((repo, idx) => {
                    return <li key={idx}>{JSON.stringify(repo)}</li>;
                  })}
                </ul>
              );
            }}
          </InfiniteScroll>
        </main>
      </div>
    );
  }
}

export default withContextConsumer(['github'])(App);
