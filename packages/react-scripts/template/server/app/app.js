import { ApolloProvider } from '@apollo/react-common';
import App from '../../client/app/App';
import createApolloClient from '../data/apollo_client';
import { DEFAULT_LOCALE, getLocale } from './locale';
import { getDataFromTree } from '@apollo/react-ssr';
import HTMLBase from './HTMLBase';
import { initializeCurrentUser } from '../../shared/data/local_state';
import { IntlProvider } from 'react-intl';
import { JssProvider, SheetsRegistry, createGenerateId } from 'react-jss';
import * as languages from '../../shared/i18n/languages';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import { StaticRouter } from 'react-router';
import theme from '../../shared/theme';
import uuid from 'uuid';

export default async function render({ req, res, next, assetPathsByType, appName, publicUrl, gitInfo }) {
  initializeCurrentUser(req.session.user);
  const apolloClient = createApolloClient(req);
  const context = {};
  const nonce = createNonceAndSetCSP(res);

  const locale = getLocale(req);
  const translations = languages[locale];

  // For Material UI setup.
  const sheets = new ServerStyleSheets();
  const sheetsNonMaterialUI = new SheetsRegistry();
  const generateId = createGenerateId();

  const coreApp = <App />;
  // We need to set leave out Material-UI classname generation when traversing the React tree for
  // Apollo data. a) it speeds things up, but b) if we didn't do this, on prod, it can cause
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
            {!isApolloTraversal
              ? sheets.collect(
                  <JssProvider registry={sheetsNonMaterialUI} generateId={generateId}>
                    <ThemeProvider theme={theme}>{coreApp}</ThemeProvider>
                  </JssProvider>
                )
              : coreApp}
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

  const materialUICSS = sheets.toString();
  const nonMaterialCSS = sheetsNonMaterialUI.toString();

  /*
    XXX(mime): Server-side rendering for CSS doesn't allow for inserting CSS the same way we do
    Apollo's data (see apolloStateFn in HTMLBase). So for now, we just do a string replace, sigh.
    See related hacky code in server/app/HTMLHead.js
  */
  const renderedAppWithCSS = renderedApp.replace(`<!--CSS-SSR-REPLACE-->`, materialUICSS + '\n' + nonMaterialCSS);

  res.type('html');
  res.write('<!doctype html>');
  res.write(renderedAppWithCSS);
  res.end();
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
