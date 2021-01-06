import { ApolloProvider } from '@apollo/react-hooks';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import createApolloClient from './apollo';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import theme from '../../shared/theme';
import { ThemeProvider } from '@material-ui/core/styles';

function renderAppTree(app) {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={theme}>{app}</ThemeProvider>
      </Router>
    </ApolloProvider>
  );
}

// We use `hydrate` here so that we attach to our server-side rendered React components.
function render() {
  const appTree = renderAppTree(<App />);
  ReactDOM.hydrate(appTree, document.getElementById('root'));
}
render();

// This enables hot module reloading for JS (HMR).
if (module.hot) {
  function hotModuleRender() {
    const NextApp = require('./App').default;
    const appTree = renderAppTree(<NextApp />);
    ReactDOM.render(appTree, document.getElementById('root'));
  }
  module.hot.accept('./App', hotModuleRender);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
