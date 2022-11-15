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
let myURI_http = '';
let myURI_ws = '';

// https://sore-leggings-crab.cyclic.app
// https://social-network-server-1994.herokuapp.com/graphql
// wss://social-network-server-1994.herokuapp.com/graphql
// https://web-production-bc2f.up.railway.app/graphql
// wss://web-production-bc2f.up.railway.app/graphql

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  myURI_http = 'http://localhost:5000/graphql';
  myURI_ws = 'ws://localhost:5000/graphql';
} else {
  myURI_http = 'https://web-production-bc2f.up.railway.app/graphql';
  myURI_ws = 'wss://web-production-bc2f.up.railway.app/graphql';
}

/* myURI_http = 'https://web-production-bc2f.up.railway.app/graphql';
myURI_ws = 'wss://web-production-bc2f.up.railway.app/graphql'; */

const httpLink = new HttpLink({
  uri: myURI_http
});

const wsLink = new WebSocketLink({
  uri: myURI_ws,
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

