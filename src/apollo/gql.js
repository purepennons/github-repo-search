import { gql } from 'apollo-boost';

export const QUERY_REPOS = gql`
  query search($keyword: String!, $perPage: Int!, $page: Int!) {
    searchRepos(keyword: $keyword, perPage: $perPage, page: $page)
      @rest(
        type: "Repos"
        path: "search/repositories?q={args.keyword}&sort=stars&order=desc&per_page={args.perPage}&page={args.page}"
      ) {
      items @type(name: "Repo") {
        id,
        full_name,
        html_url,
        description,
        language,
        stargazers_count,
        owner @type(name: "User") {
          id,
          login,
          avatar_url,
          html_url,
        },
      }
    }
  }
`;
