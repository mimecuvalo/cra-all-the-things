import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { InMemoryCache } from 'apollo-cache-inmemory';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

function renderAppTree(app) {
  // We add the Apollo/GraphQL capabilities here (also notice ApolloProvider below).
  const client = new ApolloClient({
    cache: new InMemoryCache().restore(window['__APOLLO_STATE__']),
  });

  return (
    <ApolloProvider client={client}>
      <Router>{app}</Router>
    </ApolloProvider>
  );
}

// We use `hydrate` here so that we attach to our server-side rendered React components.
ReactDOM.hydrate(renderAppTree(<App />), document.getElementById('root'));

// This enables hot module reloading for JS (HMR).
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(renderAppTree(<NextApp />), document.getElementById('root'));
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
