import React from 'react';

export default function HTMLHead({ assetPathsByType, nonce, publicUrl, req, title }) {
  return (
    <head>
      <meta charSet="utf-8" />
      <link rel="author" href={`${publicUrl}humans.txt`} />
      <link rel="shortcut icon" href={`${publicUrl}favicon.ico`} />
      {assetPathsByType['css'].map(path => (
        <link nonce={nonce} rel="stylesheet" key={path} href={path} />
      ))}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <link rel="search" href="/api/opensearch" type="application/opensearchdescription+xml" title={title} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="generator" content="cra-all-the-things. https://github.com/mimecuvalo/all-the-things" />
      <OpenGraphMetadata title={title} req={req} />
      <StructuredMetaData nonce={nonce} title={title} req={req} />
      {/*
        manifest.json provides metadata used when your web app is added to the
        homescreen on Android. See https://developers.google.com/web/fundamentals/web-app-manifest/
      */}
      <link rel="manifest" href={`${publicUrl}manifest.json`} />
      {/*
        Notice the use of publicUrl in the tags above.
        It will be replaced with the URL of the `public` folder during the build.
        Only files inside the `public` folder can be referenced from the HTML.

        Unlike "/favicon.ico" or "favicon.ico", "${publicUrl}favicon.ico" will
        work correctly both with client-side routing and a non-root public URL.
        Learn how to configure a non-root public URL by running `npm run build`.
      */}
      <title>{title}</title>
      {/*
        XXX(mime): Material UI's server-side rendering for CSS doesn't allow for inserting CSS the same way we do
        Apollo's data (see apolloStateFn in HTMLBase). So for now, we just do a string replace, sigh.
        See related hacky code in server/app/app.js
      */}
      <style id="jss-ssr" dangerouslySetInnerHTML={{ __html: `<!--MATERIAL-UI-CSS-SSR-REPLACE-->` }} />
    </head>
  );
}

// This needs to be filled out by the developer to provide content for the site.
// Learn more here: http://ogp.me/
function OpenGraphMetadata({ title, req }) {
  // TODO(mime): combine with url_factory code.
  const protocol = req.get('x-scheme') || req.protocol;
  const url = `${protocol}://${req.get('host')}`;

  return (
    <>
      <meta property="og:title" content="page title" />
      <meta property="og:description" content="page description" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={title} />
      <meta property="og:image" content={`${url}favicon.ico`} />
    </>
  );
}

// This needs to be filled out by the developer to provide content for the site.
// Learn more here: https://developers.google.com/search/docs/guides/intro-structured-data
function StructuredMetaData({ title, req, nonce }) {
  // TODO(mime): combine with url_factory code.
  const protocol = req.get('x-scheme') || req.protocol;
  const url = `${protocol}://${req.get('host')}`;

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
            "@id": "${url}"
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
              "url": "${url}favicon.ico"
            }
          },
          "description": "page description"
        }
        `,
      }}
    />
  );
}
