import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import Context from '../context/';
import DebounceHookOnChange from '../components/global/DebounceHookOnChange/DebounceHookOnChange';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';
import StyledRepo from '../components/StyledRepo/StyledRepo';

const { withContextConsumer } = Context;

class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

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
      className,
      github: { actions, repos, isLoading }
    } = this.props;
    return (
      <div className={className}>
        <header>
          <DebounceHookOnChange
            wait={500}
            onChange={this.handleChange}
            onDebounceChange={this.handleDebounceChange}
          >
            {onChange => (
              <input
                type="text"
                placeholder="輸入關鍵字搜尋 Repository..."
                onChange={onChange}
                ref={this.inputRef}
              />
            )}
          </DebounceHookOnChange>
        </header>
        <main>
          <InfiniteScroll
            onFetchMore={actions.fetchMore}
            className="infinite-scroll"
          >
            {() => {
              return (
                <div>
                  {repos.map(repo => (
                    <StyledRepo {...repo} key={repo.id} />
                  ))}
                  {isLoading && <p className="loading">Loading...</p>}
                </div>
              );
            }}
          </InfiniteScroll>
        </main>
      </div>
    );
  }
}

const StyledApp = styled(App)`
  margin: 0 5%;

  header {
    height: 120px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    border-bottom: 5px solid #00c7b9;
    margin-bottom: 20px;

    input[type='text'] {
      font-size: ${rem('20px')};
      width: 40%;
      height: 60px;
      line-height: 60px;
      padding: 5px 5%;
      text-align: center;
      border: 5px solid #00c7b9;
      border-radius: 5px;
    }
  }

  main {
    padding-bottom: 20px;

    .infinite-scroll {
      overflow: auto;
      height: calc(100vh - 120px - 20px);
    }

    .loading {
      font-size: ${rem('25px')};
      font-weight: 600;
      text-align: center;
      color: #595a53;
    }
  }
`;

export default withContextConsumer(['github'])(StyledApp);
