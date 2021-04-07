import { ApolloClient, ApolloProvider, HttpLink } from '@apollo/client';
import { render, screen } from '@testing-library/react';

import App from './App';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { IntlProvider } from 'react-intl-wrapper';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'shared/theme';

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

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
