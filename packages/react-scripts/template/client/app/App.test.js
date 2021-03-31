import App from './App';
import { ApolloClient, ApolloProvider, HttpLink } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { IntlProvider } from 'react-intl-wrapper';
import React from 'react';
import ReactDOM from 'react-dom';
import theme from '../../shared/theme';
import { ThemeProvider } from '@material-ui/core/styles';

it('renders without crashing', () => {
  window.scrollTo = () => {}; // Used in app/App.js

  const div = document.createElement('div');

  const client = new ApolloClient({
    link: new HttpLink({ apolloUrl: '/graphql' }),
    cache: new InMemoryCache(),
  });

  ReactDOM.render(
    <IntlProvider locale={'en'} messages={{}}>
      <ApolloProvider client={client}>
        <Router>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Router>
      </ApolloProvider>
    </IntlProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
