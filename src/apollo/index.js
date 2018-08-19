import { ApolloClient, InMemoryCache, ApolloLink } from 'apollo-boost';
import { RestLink } from 'apollo-link-rest';

const cache = new InMemoryCache();
const restLink = new RestLink({
  uri: 'https://api.github.com/'
});

// setup your client
const client = new ApolloClient({
  link: ApolloLink.from([restLink]),
  cache
});

export default client;
