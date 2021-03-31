import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
const makeApolloClient = () => {
  const link = new HttpLink({
    uri: 'https://api.joinsport.io/graphql',
    headers: {
      'Api-Key':
        // 'GJypQHN4yRsKzw9rKmEkEU3VCuPHVbQxQQeQMnmXCUW9pJEdB42kPk8QWvPg376c',
        'VJGPfCwBeCxhs25uegPsajabwm8DbzKte4W47fDZQ2Wxm5D28tWVr2WX8rmHgwhb',
    },
  });
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    link,
    cache,
  });
  return client;
};
export default makeApolloClient;
