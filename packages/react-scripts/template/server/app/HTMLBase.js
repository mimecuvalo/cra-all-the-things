import HTMLHead from './HTMLHead';
import React from 'react';

export default function HTMLBase({ assetPathsByType, apolloStateFn, title, publicUrl, children, csrfToken }) {
  return (
    <html lang="en">
      <HTMLHead assetPathsByType={assetPathsByType} title={title} publicUrl={publicUrl} />
      <body>
        <div id="root">{children}</div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.configuration = {
                csrf: '${csrfToken}',
              };
            `,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            var hasGlobalErrorFired = false;
            window.onerror = function(message, file, line, column, error) {
              if (hasGlobalErrorFired) {
                return;
              }
              hasGlobalErrorFired = true;

              var data = {
                random: Math.random(),
                context: navigator.userAgent,
                message: message,
                file: file,
                line: line,
                column: column,
                url: window.location.href
              };
              var img = new Image();
              img.src = '/api/report-error?data=' + encodeURIComponent(JSON.stringify(data));
            };`,
          }}
        />

        {/*
          TODO(mime): This would be blocked by a CSP policy that doesn't allow inline scripts.
          Try to get a nonce here instead.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__ = ${JSON.stringify(apolloStateFn()).replace(/</g, '\\u003c')};`,
          }}
        />

        {assetPathsByType['js'].map(path => (
          <script key={path} src={path} />
        ))}

        {/*
          This HTML file is a template.
          If you open it directly in the browser, you will see an empty page.

          You can add webfonts, meta tags, or analytics to this file.
          The build step will place the bundled scripts into the <body> tag.

          To begin the development, run `npm start` or `yarn start`.
          To create a production bundle, use `npm run build` or `yarn build`.
        */}

        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
  );
}
