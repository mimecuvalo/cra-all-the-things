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

export default async function render({ req, res, assetPathsByType, appName, publicUrl, urls }) {
  const apolloClient = await createApolloClient();
  const context = {};

  const completeApp = (
    <HTMLBase
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
