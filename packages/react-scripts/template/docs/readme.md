<h1 align="center">
  🔮 Project Name
</h1>
<blockquote align="center">
  Quick blurb.
</blockquote>

<p align="center">
  <a href="https://travis-ci.org/username/project">
    <img src="https://img.shields.io/travis/username/project.svg" alt="CI status" />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="prettier status" />
  </a>
  <a href="https://github.com/username/project/docs/license.md">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="license" />
  </a>
</p>

## 📯 Description

Write your stunning description here.

## 💾 Install

```sh
npx create-react-app react-all-the-things --use-npm --scripts-version=cra-all-the-things
```

Then, to run your newly created server locally, **with** the Storybook styleguide server:

```sh
npm start
```

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
npm run serve:prod
```

To run tests:

```sh
npm run test
```

## 📙 Learn More

### [Changelog](changelog.md)

### [Code of Conduct](code_of_conduct.md)

### [Contributing](contributing.md)

### [Contributors](contributors.md)

### [Support](support.md)

## 📜 License

[MIT](license.md)

(The format is based on [Make a README](https://www.makeareadme.com/))
