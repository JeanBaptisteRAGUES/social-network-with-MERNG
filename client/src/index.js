import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from '@apollo/client/link/context';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

//TODO: gérer quand c'est pas localhost
let myURI = '';
/* const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql'
}); */
/* const httpLink = new HttpLink({
  uri: 'https://fierce-gorge-01389.herokuapp.com/',
}); */
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  myURI = 'http://localhost:5000/graphql';
} else {
  myURI = 'https://fierce-gorge-01389.herokuapp.com/graphql';
}

//Test : "https://social-network-with-merng.herokuapp.com/graphql"
//Test2 : "https://social-network-server-1994.herokuapp.com/graphql"

const httpLink = new HttpLink({
  uri: myURI
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwtToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

console.log(JSON.stringify(authLink));

render(
  <ApolloProvider client={client}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ApolloProvider>,
  document.getElementById('root'),
);

