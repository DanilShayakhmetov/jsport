import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
const makeApolloClient = (token) => {
  // create an apollo link instance, a network interface for apollo client
  const link = new HttpLink({
    uri: 'https://api.joinsport.io/graphql',
    headers: {
      'Api-Key':
        'GJypQHN4yRsKzw9rKmEkEU3VCuPHVbQxQQeQMnmXCUW9pJEdB42kPk8QWvPg376c',
    },
  });
  // create an inmemory cache instance for caching graphql data
  const cache = new InMemoryCache();
  // instantiate apollo client with apollo link instance and cache instance
  const client = new ApolloClient({
    link,
    cache,
  });
  return client;
};
export default makeApolloClient;
