import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LinesEllipsis from 'react-lines-ellipsis';
import { isFinite } from 'lodash';

import { $primaryColor, $titleColor } from '../../constants/style';

const Repo = ({
  className,
  id,
  full_name,
  html_url,
  description,
  language,
  stargazers_count,
  owner
}) => {
  return (
    <div className={className}>
      <div className="left">
        <h2>
          <a href={html_url}>{full_name}</a>
        </h2>
        <LinesEllipsis
          trimRight
          maxLine={3}
          ellipsis="..."
          basedOn="words"
          text={description || ''}
          title={description || ''}
        />
      </div>
      <div className="right">
        <span className="stars">★ {stargazers_count}</span>
        <span className="lang">{language}</span>
        <a className="avatar" href={owner.html_url}>
          <img src={owner.avatar_url} alt="owner-avatar" />
        </a>
      </div>
    </div>
  );
};

const StyledRepo = styled(Repo).attrs({
  height: props =>
    isFinite(props.height)
      ? `${parseInt(props.height, 10)}px`
      : props.height || '200px'
})`
  height: ${props => props.height};
  border-bottom: 2px solid #8eacb7;
  position: relative;
  padding: 20px;
  margin: 30px auto;

  .left {
    h2 {
      a {
        text-decoration: none;
        color: ${$titleColor};

        &:active {
          color: ${$titleColor};
        }
      }
    }

    div {
      max-width: 65%;
      line-height: 1.5;
    }
  }

  .right {
    position: absolute;
    bottom: 20px;
    right: 20px;

    > * {
      line-height: 30px;
      margin: 10px;
    }

    .avatar {
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid ${$primaryColor};
        vertical-align: middle;
      }
    }
  }
`;

StyledRepo.propTypes = {
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  full_name: PropTypes.string,
  html_url: PropTypes.string,
  description: PropTypes.string,
  language: PropTypes.string,
  stargazers_count: PropTypes.number,
  owner: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    login: PropTypes.string,
    avatar_url: PropTypes.string,
    html_url: PropTypes.string
  })
};

StyledRepo.defaultProps = {
  className: '',
  height: '200px',
  full_name: '',
  html_url: '',
  description: '',
  language: '',
  stargazers_count: 0,
  owner: {
    login: '',
    avatar_url: '',
    html_url: ''
  }
};

/** @component */
export default StyledRepo;
