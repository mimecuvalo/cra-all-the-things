import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import App from '../../client/app/App';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import HTMLBase from './HTMLBase';
import { InMemoryCache } from 'apollo-cache-inmemory';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';

export default async function render({ req, res, assetPathsByType, appName, publicUrl }) {
  const apolloClient = await createApolloClient();
  const context = {};

  const completeApp = (
    <HTMLBase
      title={appName}
      assetPathsByType={assetPathsByType}
      publicUrl={publicUrl}
      apolloStateFn={() => apolloClient.extract()}
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
    // TODO(all-the-things): probably could use SchemaLink here but currently having trouble with
    // CJS<->ESM crossover with the schema.js file. Blargh.
    link: createHttpLink({
      uri: 'http://localhost:3001/graphql',
      credentials: 'same-origin',
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });

  return client;
}
