import HTMLHead from './HTMLHead';
import React from 'react';

export default function HTMLBase({
  nonce,
  assetPathsByType,
  apolloStateFn,
  title,
  urls,
  publicUrl,
  children,
  csrfToken,
}) {
  return (
    <html lang="en">
      <HTMLHead nonce={nonce} assetPathsByType={assetPathsByType} title={title} publicUrl={publicUrl} urls={urls} />
      <body>
        <div id="root">{children}</div>
        <ConfigurationScript nonce={nonce} csrfToken={csrfToken} />
        <WindowErrorScript nonce={nonce} />

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
          <script nonce={nonce} key={path} src={path} />
        ))}

        <StructuredMetaData nonce={nonce} title={title} urls={urls} />

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

function ConfigurationScript({ csrfToken, nonce }) {
  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
          window.configuration = {
            csrf: '${csrfToken}',
          };
        `,
      }}
    />
  );
}

function WindowErrorScript({ nonce }) {
  return (
    <script
      nonce={nonce}
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
  );
}

// This needs to be filled out by the developer to provide content for the site.
// Learn more here: https://developers.google.com/search/docs/guides/intro-structured-data
function StructuredMetaData({ title, urls, nonce }) {
  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
        {
          "@context": "http://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${urls.localUrlForBrowser}"
          },
          "headline": "page title",
          "image": [
            "https://example.com/photos/16x9/photo.jpg"
           ],
          "datePublished": "2015-02-05T08:00:00+08:00",
          "dateModified": "2015-02-05T09:20:00+08:00",
          "author": {
            "@type": "Person",
            "name": "John Doe"
          },
           "publisher": {
            "@type": "Organization",
            "name": "${title}",
            "logo": {
              "@type": "ImageObject",
              "url": "${urls.localUrlForBrowser}favicon.ico"
            }
          },
          "description": "page description"
        }
        `,
      }}
    />
  );
}
