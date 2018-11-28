import React from 'react';

export default function HTMLHead({ assetPathsByType, title, publicUrl }) {
  return (
    <head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href={`${publicUrl}/favicon.ico`} />
      {assetPathsByType['css'].map(path => (
        <link rel="stylesheet" key={path} href={path} />
      ))}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      {/*
        manifest.json provides metadata used when your web app is added to the
        homescreen on Android. See https://developers.google.com/web/fundamentals/web-app-manifest/
      */}
      <link rel="manifest" href={`${publicUrl}/manifest.json`} />
      {/*
        Notice the use of publicUrl in the tags above.
        It will be replaced with the URL of the `public` folder during the build.
        Only files inside the `public` folder can be referenced from the HTML.

        Unlike "/favicon.ico" or "favicon.ico", "${publicUrl}/favicon.ico" will
        work correctly both with client-side routing and a non-root public URL.
        Learn how to configure a non-root public URL by running `npm run build`.
      */}
      <title>{title}</title>
    </head>
  );
}
