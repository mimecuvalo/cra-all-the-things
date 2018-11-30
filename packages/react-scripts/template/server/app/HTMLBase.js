import HTMLHead from './HTMLHead';
import React from 'react';

export default function HTMLBase({ assetPathsByType, title, publicUrl, children }) {
  return (
    <html lang="en">
      <HTMLHead assetPathsByType={assetPathsByType} title={title} publicUrl={publicUrl} />
      <body>
        <div id="root">{children}</div>

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
