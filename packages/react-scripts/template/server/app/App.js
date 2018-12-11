import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import App from '../../client/app/App';
import HTMLBase from './HTMLBase';
import { InMemoryCache } from 'apollo-cache-inmemory';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { schema } from '../graphql/schema';
import { SchemaLink } from 'apollo-link-schema';
import { StaticRouter } from 'react-router';
import uuid from 'uuid';

export default async function render({ req, res, assetPathsByType, appName, publicUrl, urls }) {
  const apolloClient = await createApolloClient();
  const context = {};
  const nonce = createNonceAndSetCSP(res);

  const completeApp = (
    <HTMLBase
      nonce={nonce}
      title={appName}
      assetPathsByType={assetPathsByType}
      publicUrl={publicUrl}
      urls={urls}
      apolloStateFn={() => apolloClient.extract()}
      csrfToken={req.csrfToken()}
    >
      <ApolloProvider client={apolloClient}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    </HTMLBase>
  );

  // This is so we can do `apolloClient.extract()` later on.
  await getDataFromTree(completeApp);

  res.write('<!doctype html>');
  const stream = renderToNodeStream(completeApp);
  stream.pipe(res);

  if (context.url) {
    res.redirect(301, context.url);
    return;
  }
}

// We create an Apollo client here on the server so that we can get server-side rendering in properly.
async function createApolloClient() {
  const client = new ApolloClient({
    ssrMode: true,
    link: new SchemaLink({ schema }),
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
