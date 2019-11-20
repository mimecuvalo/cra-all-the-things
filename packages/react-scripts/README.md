<h1 align="center">
  🔮 create-react-app, ✨ ALL THE THINGS ✨ edition
</h1>

<p align="center">
  <a href="https://dev.azure.com/mimecuvalo/all-the-things/_build/latest?definitionId=1&branchName=master"><img src="https://dev.azure.com/mimecuvalo/all-the-things/_apis/build/status/mimecuvalo.all-the-things?branchName=master" alt="CI status" /></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="prettier status" /></a>
  <a href="https://github.com/mimecuvalo/all-the-things/docs/license.md"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="license" /></a>
</p>

<strong>NOTE: still under active development and I'm not currently providing backwards compatibility until things stabilize.</strong>

## 📯 Description

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app) but with LOTS more bells 🔔 and whistles 😗.

## ⚡ Features

- **accessibility (a11y) analyzer**: via [axe](https://www.google.com/search?q=axe-core&oq=axe-core&aqs=chrome..69i57.1485j0j7&sourceid=chrome&ie=UTF-8). in the bottom corner of CRA you’ll see a menu that will give you a list of items your site is violating in terms of a11y.
- **authentication**: via [Auth0](https://auth0.com/). gives you the ability to login using Google/Facebook.
- **bundle size analyzer**: à la [CRA’s docs](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size) and [source-map-explorer](https://www.npmjs.com/package/source-map-explorer). do `npm run analyze` after creating a build.
- **component Libary (UI)**: via [Material-UI](https://material-ui.com/).
- **CSP nonce**: adds example code in `server/app/app.js` (not enabled though).
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
- **local state**: adds [Apollo's Local State](https://www.apollographql.com/docs/react/data/local-state/).
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

## 💾 Install

```sh
npx create-react-app react-all-the-things --use-npm --scripts-version=cra-all-the-things
```

Then, to run your newly created server locally, **with** the Storybook styleguide server:

```sh
npm start
```

_Prerequisites: Node 13+ if you want proper internationalization (i18n) support (via full-icu)._

Or, to run locally **without** the Storybook styleguide server:

```sh
npm run serve:dev
```

In dev or prod you'll want to setup your environment as well. Check out the `.env.example` file and `mv` it to `.env.development.local` (or `.env` for prod) and set the various variables:

- `REACT_APP_DB*` for your database
- `REACT_APP_SESSION_SECRET` for session management
- `REACT_APP_AUTH0*` variables if you would like to use Auth0 for logging in

To run in production (or better yet check out bin/flightplan.js)

```sh
npm --production install
npm run build
npm run serve:prod
```

To run tests:

```sh
npm run test
```

### 🔨 Development (of this meta-repo, not of the repo created by the npx command above)

To run locally, **with** the Storybook styleguide server:

```sh
yarn
cd packages/react-scripts  # TODO(mime) need to get rid of this command eventually - it's a crutch
npm install
cd ../../
yarn start
```

To run locally, **without** the Storybook styleguide server:

```sh
yarn serve:dev
```

To run tests:

```sh
yarn:test
```

To change port, in an `.env` change the values to what you desire:

```sh
PORT=3000
REACT_APP_SSR_PORT=3001
```

To run migrations:

```sh
npx sequelize db:migrate && npx sequelize db:seed:all
```

To create a new migration:

```sh
npx sequelize migration:generate --name [migration_name]
```

To learn more about Sequelize and migrations, read the docs [here](https://sequelize.org/master/manual/migrations.html).

## 👉 See main [README.md](https://github.com/mimecuvalo/all-the-things) for roadmap and more details! 👈

## 📜 License

[MIT](license.md)

(The format is based on [Make a README](https://www.makeareadme.com/))
