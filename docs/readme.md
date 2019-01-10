<h1 style="text-align: center">
  🔮 create-react-app, ✨ ALL THE THINGS ✨ edition
</h1>
<blockquote style="border: 0; text-align: center">
  DO NOT USE - NOT QUITE READY FOR BROAD USE YET!
</blockquote>

<p style="text-align: center">

[![CI status](https://img.shields.io/travis/mimecuvalo/all-the-things.svg)](https://travis-ci.org/mimecuvalo/all-the-things)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](license.md)

</p>

## 📯 Description

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://github.com/facebook/create-react-app/blob/master/README.md#getting-started) – How to create a new app.
- [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md) – How to develop apps bootstrapped with Create React App.

## 💾 Install

```sh
npx create-react-app react-all-the-things --use-npm --scripts-version=all-the-things
```

### 🔨 Development

To run locally:

```sh
yarn start:dev
```

To run tests:

```sh
yarn:test
```

## ⚡ Features

- **accessibility (a11y) analyzer**: via [axe](https://www.google.com/search?q=axe-core&oq=axe-core&aqs=chrome..69i57.1485j0j7&sourceid=chrome&ie=UTF-8). in the bottom corner of CRA you’ll see a menu that will give you a list of items your site is violating in terms of a11y.
- **authentication**: via [Auth0](https://auth0.com/). gives you the ability to login using Google/Facebook.
- **bundle size analyzer**: à la [CRA’s docs](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size) and [source-map-explorer](https://www.npmjs.com/package/source-map-explorer). do `npm run analyze` after creating a build.
- **component Libary (UI)**: via [Material-UI](https://material-ui.com/).
- **CSP nonce**: adds example code in `server/app/app.js` (not enabled though).
- **decorators (ES6)**: yes, they’re experimental and probably shouldn’t use but they’re sooo nice.
- **documentation**: adds some standard and GitHub-specific Markdown files using best practices. files include:
  - [changelog](https://keepachangelog.com)
  - [code of conduct](https://www.contributor-covenant.org)
  - [code owners](https://help.github.com/articles/about-code-owners/) (GitHub-specific)
  - contributing: based off of [Atom’s](https://github.com/atom/atom/blob/master/CONTRIBUTING.md).
  - contributors
  - [issue template](https://help.github.com/articles/about-issue-and-pull-request-templates/) (GitHub-specific)
  - license
  - [pull request template](https://help.github.com/articles/about-issue-and-pull-request-templates/) (GitHub-specific)
  - [readme](https://www.makeareadme.com/)
  - [support](https://help.github.com/articles/adding-support-resources-to-your-project/) (GitHub-specific)
- **error boundary**: adds a top-level one to the app. (see [doc](https://reactjs.org/docs/error-boundaries.html)).
- **error pages**: [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), [404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404), [500](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500).
- **error reporting**: listens to `window.onerror` and reports JS errors to the server for debugging.
- [**Flow**](https://flow.org): enable by default (off by default in CRA).
- [**hot module replacement (HMR)**](https://webpack.js.org/concepts/hot-module-replacement/): enable by default (off by default in CRA).
- [**humans.txt**](http://humanstxt.org/) **/** [**robots.txt**](http://www.robotstxt.org/): adds stubs of these files.
- [**Jest**](https://jestjs.io/): installs [Enzyme](https://airbnb.io/enzyme/) into the mix by default.
- **i18n**: via [react-intl](https://github.com/yahoo/react-intl/wiki#getting-started).
- **kill switch**: runs a client health check every 5 minutes to see if the client is still valid.
- **libraries**: adds [lodash](https://lodash.com) by default.
- **logger**: via [winston](https://github.com/winstonjs/winston).
- **node inspection**: adds `--inspect` for development mode.
- [**Open Graph**](http://ogp.me/): adds stub for social media embedding.
- [**OpenSearch**](http://www.opensearch.org/Home): adds stub file so that you can add search queries to your site later.
- **ORM**: via [sequelize](http://docs.sequelizejs.com/).
- **perf indicator**: in the bottom corner of the app, it will display render times.
- [**Prettier**](https://prettier.io): adds linting upon commit.
- [**React Router**](https://reacttraining.com/react-router/): adds AJAX-navigation, and code splitting via React.lazy and Suspense.
- **server**: i know, heresy!
  - adds [Express](https://expressjs.com/).
  - adds Server-side rendering (SSR).
  - adds [GraphQL](https://graphql.org) and [Apollo](https://apollographql.com).
  - stubs out an API server.
- **structured data**: via [JSON-LD](https://developers.google.com/search/docs/guides/intro-structured-data).
- **styleguide**: via [Storybook](https://storybook.js.org).
- **xsrf/csrf protection**: via [csurf](https://github.com/expressjs/csurf).

## 🗺️ Roadmap

### p0 (high pri)

- CI integration, for own repo and template
  - perhaps, Danger JS
- PWA, explore enabling by default (desktop PWA, too?) - but probably won't
  - https://hnpwa.com/
  - https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
  - https://developers.google.com/web/fundamentals/performance/prpl-pattern/
  - https://developers.google.com/web/updates/2018/07/pwacompat
  - https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
  - https://developers.google.com/web/tools/workbox/

### p1 (medium pri)

- admin panel
  - exception reports
  - system info
  - add docusaurus / read the docs (for this repo and template)
- authentication - add ability to refresh tokens (auth0)
- i18n features
  - message extractor
  - polyfill for `Intl` for older browsers
  - highlight missing translations
  - add fallback capability
  - RTL
- experiments framework
- add "test:debug" to scripts for [chrome testing](https://facebook.github.io/create-react-app/docs/debugging-tests)
- more tests and https://coveralls.io
- background tasks (if anything, at least via cron)
- bundle analyzers (bundlesize, webpack-bundle-analyzer, webpack-dashboard)
- ability to config repo (add name/email to Markdown docs at least)
- GitHub PR request, show infobar of impact of PR
- TypeScript (syncing `template-typescript` with `template`)
- redux

### p2 (ideas)

- staging / canary server flags
- lazy load image capability
- event bus
- Redis
- immutability, via immutable.js / immer
- fp: ramda, observables, rxjs

## 📙 Learn More

### [Changelog](changelog.md)

### [Code of Conduct](code_of_conduct.md)

### [Contributing](contributing.md)

### [Contributors](contributors.md)

### [Support](support.md)

## 📜 License

[MIT](license.md)

(The format is based on [Make a README](https://www.makeareadme.com/))
