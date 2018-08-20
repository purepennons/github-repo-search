import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { debounce } from 'lodash';

import Context from '../context/';
import DebounceHookOnChange from '../components/global/DebounceHookOnChange/DebounceHookOnChange';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';
import StyledRepo from '../components/StyledRepo/StyledRepo';
import ErrorBoundary from '../components/global/ErrorBoundary/ErrorBoundary';
import { $repoHeight, $primaryColor, $messageColor } from '../constants/style';

const { withContextConsumer } = Context;

class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  async componentDidMount() {
    await this.changePerPage();
    this.inputRef.current.focus();

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  changePerPage = debounce(() => {
    const {
      github: { actions }
    } = this.props;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    return actions.setPerPage(parseInt(windowHeight / $repoHeight, 10));
  }, 500).bind(this);

  handleResize = event => {
    return this.changePerPage();
  };

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

  handleError = clearError => async () => {
    const {
      github: { actions }
    } = this.props;
    await actions.resetRepos();
    clearError();
  };

  renderError = ({ clearError }) => {
    return (
      <p className="status">
        糟糕！系統發生預期外的錯誤，請重整頁面或點擊
        <button onClick={this.handleError(clearError)}>此處</button>
        恢復。
      </p>
    );
  };

  render() {
    const {
      className,
      github: { actions, repos, isLoading, error }
    } = this.props;
    return (
      <ErrorBoundary renderError={this.renderError}>
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
                    {repos.map((repo, idx) => (
                      <StyledRepo {...repo} key={idx} height={$repoHeight} />
                    ))}
                    {isLoading && <p className="status">Loading...</p>}
                    {error &&
                      error.code === 404 && (
                        <p className="status">No repos are matched.</p>
                      )}
                    {error &&
                      error.code !== 404 && (
                        <p className="status">Oops! Something wrong!</p>
                      )}
                  </div>
                );
              }}
            </InfiniteScroll>
          </main>
        </div>
      </ErrorBoundary>
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
    border-bottom: 5px solid ${$primaryColor};
    margin-bottom: 20px;

    input[type='text'] {
      font-size: ${rem('20px')};
      width: 40%;
      height: 60px;
      line-height: 60px;
      padding: 5px 5%;
      text-align: center;
      border: 5px solid ${$primaryColor};
      border-radius: 5px;
    }
  }

  main {
    padding-bottom: 20px;

    .infinite-scroll {
      overflow: auto;
      height: calc(100vh - 120px - 30px);
    }

    .status {
      font-size: ${rem('25px')};
      font-weight: 600;
      text-align: center;
      color: ${$messageColor};
    }
  }
`;

export default withContextConsumer(['github'])(StyledApp);
