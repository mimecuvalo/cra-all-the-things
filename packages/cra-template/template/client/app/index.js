import { ApolloProvider } from '@apollo/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import configuration from './configuration';
import createApolloClient from './apollo';
import './index.css';
import { IntlProvider, isInternalLocale, setLocales } from 'react-intl-wrapper';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import theme from '../../shared/theme';
import { ThemeProvider } from '@material-ui/core/styles';

setLocales({
  defaultLocale: configuration.defaultLocale,
  locales: configuration.locales,
});

async function renderAppTree(app) {
  const client = createApolloClient();

  let translations = {};
  // This is to dynamically load language packs as needed. We don't need them all client-side.
  if (configuration.locale !== configuration.defaultLocale && !isInternalLocale(configuration.locale)) {
    translations = (await import(`../../shared/i18n-lang-packs/${configuration.locale}`)).default;
  }

  return (
    <React.StrictMode>
      <IntlProvider defaultLocale={configuration.locale} locale={configuration.locale} messages={translations}>
        <ApolloProvider client={client}>
          <Router>
            <ThemeProvider theme={theme}>{app}</ThemeProvider>
          </Router>
        </ApolloProvider>
      </IntlProvider>
    </React.StrictMode>
  );
}

// We use `hydrate` here so that we attach to our server-side rendered React components.
async function render() {
  const appTree = await renderAppTree(<App />);
  ReactDOM.hydrate(appTree, document.getElementById('root'));
}
render();

// This enables hot module reloading for JS (HMR).
if (module.hot) {
  async function hotModuleRender() {
    const NextApp = require('./App').default;
    const appTree = await renderAppTree(<NextApp />);
    ReactDOM.render(appTree, document.getElementById('root'));
  }
  module.hot.accept('./App', hotModuleRender);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();