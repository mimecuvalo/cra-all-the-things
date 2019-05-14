import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import App from '../../client/app/App';
import { DEFAULT_LOCALE, getLocale } from './locale';
import fetch from 'node-fetch';
import HTMLBase from './HTMLBase';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { IntlProvider } from 'react-intl';
import JssProvider from 'react-jss/lib/JssProvider';
import * as languages from '../../shared/i18n/languages';
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import { onError } from 'apollo-link-error';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'jss';
import { StaticRouter } from 'react-router';
import uuid from 'uuid';

export default async function render({ req, res, next, assetPathsByType, appName, publicUrl, gitInfo }) {
  const apolloClient = await createApolloClient(req);
  const context = {};
  const nonce = createNonceAndSetCSP(res);

  const locale = getLocale(req);
  const translations = languages[locale];

  // For Material UI setup.
  const sheetsRegistry = new SheetsRegistry();
  const sheetsManager = new Map();
  const generateClassName = createGenerateClassName();
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  });

  const coreApp = <App user={req.session.user} />;
  // We need to set leave out Material-UI classname generation when traversing the React tree for
  // react-apollo data. a) it speeds things up, but b) if we didn't do this, on prod, it can cause
  // classname hydration mismatches.
  const completeApp = isApolloTraversal => (
    <IntlProvider locale={locale} messages={translations}>
      <HTMLBase
        apolloStateFn={() => apolloClient.extract()}
        appTime={gitInfo.gitTime}
        appVersion={gitInfo.gitRev}
        assetPathsByType={assetPathsByType}
        csrfToken={req.csrfToken()}
        defaultLocale={DEFAULT_LOCALE}
        locale={locale}
        nonce={nonce}
        publicUrl={publicUrl}
        req={req}
        title={appName}
        user={req.session.user}
      >
        <ApolloProvider client={apolloClient}>
          <StaticRouter location={req.url} context={context}>
            {!isApolloTraversal ? (
              <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                  {coreApp}
                </MuiThemeProvider>
              </JssProvider>
            ) : (
              coreApp
            )}
          </StaticRouter>
        </ApolloProvider>
      </HTMLBase>
    </IntlProvider>
  );

  // This is so we can do `apolloClient.extract()` later on.
  try {
    await getDataFromTree(completeApp(true /* isApolloTraversal */));
  } catch (ex) {
    next(ex);
    return;
  }

  const renderedApp = renderToString(completeApp(false /* isApolloTraversal */));
  if (context.url) {
    res.redirect(301, context.url);
    return;
  }

  const materialUICSS = sheetsRegistry.toString();

  /*
    XXX(mime): Material UI's server-side rendering for CSS doesn't allow for inserting CSS the same way we do
    Apollo's data (see apolloStateFn in HTMLBase). So for now, we just do a string replace, sigh.
    See related hacky code in server/app/HTMLHead.js
  */
  const renderedAppWithMaterialUICSS = renderedApp.replace(`<!--MATERIAL-UI-CSS-SSR-REPLACE-->`, materialUICSS);

  res.type('html');
  res.write('<!doctype html>');
  res.write(renderedAppWithMaterialUICSS);
  res.end();
}

// We create an Apollo client here on the server so that we can get server-side rendering in properly.
async function createApolloClient(req) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`\n[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}\n`)
      );
    }
    if (networkError) {
      console.log(`\n[Network error]: ${networkError}\n`);
    }
  });

  const cookieLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        cookie: req.get('cookie'),
      },
    });
    return forward(operation);
  });

  const httpLink = new HttpLink({ uri: `http://localhost:${req.socket.localPort}/graphql`, fetch });

  const link = ApolloLink.from([errorLink, cookieLink, httpLink]);

  const client = new ApolloClient({
    ssrMode: true,
    link,
    cache: new InMemoryCache(),
  });

  return client;
}

function createNonceAndSetCSP(res) {
  // nonce is used in conjunction with a CSP policy to only execute scripts that have the correct nonce attribute.
  // see https://content-security-policy.com
  const nonce = uuid.v4();

  // If you wish to enable CSP, here's a sane policy to start with.
  // NOTE! this *won't* work with webpack currently!!!
  // TODO(mime): fix this. see https://webpack.js.org/guides/csp/
  // res.set('Content-Security-Policy',
  //     `upgrade-insecure-requests; ` +
  //     `default-src 'none'; ` +
  //     `script-src 'self' 'nonce-${nonce}'; ` +
  //     `style-src 'self' https://* 'nonce-${nonce}'; ` +
  //     `font-src 'self' https://*; ` +
  //     `connect-src 'self'; ` +
  //     `frame-ancestors 'self'; ` +
  //     `frame-src 'self' http://* https://*; ` +
  //     `media-src 'self' blob:; ` +
  //     `img-src https: http: data:; ` +
  //     `object-src 'self';`);

  return nonce;
}
