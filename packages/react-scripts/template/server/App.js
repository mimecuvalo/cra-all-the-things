import App from '../src/App';
import HTMLBase from './HTMLBase';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';

export default function render(req, res, assetPathsByType) {
  const context = {};
  res.write('<!doctype html>');
  const stream = renderToNodeStream(
    <HTMLBase assetPathsByType={assetPathsByType}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </HTMLBase>
  );
  stream.pipe(res);

  if (context.url) {
    res.redirect(301, context.url);
    return;
  }
}
