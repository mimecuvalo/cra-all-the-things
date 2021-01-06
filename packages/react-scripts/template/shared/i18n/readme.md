‼️ NOTE: still under construction ‼️

<h1 align="center">
  react-intl convenience wrapper
</h1>

## 📯 Description

This helps set up some convenient tools when using `react-intl`.

- adds short `F` tag for translation
- automatically generates a message id based on the content/description
- provides internal locales for testing (àçčëńtėd, and looooooong)
- provides `fallback` property to give untranslated strings something decent to show
- provides extraction tool based on the automatic message id

## 💾 Setup

### .babelrc

```json
{
  "presets": ["react-app"],
  "plugins": ["@babel/plugin-proposal-optional-chaining", "module:react-intl-wrapper"]
}
```

### For extraction, install `extract-react-intl-messages` and add to your `package.json`

```.json
"scripts": {
  "extract-messages": "NODE_ENV=development extract-messages -l=en -o build/messages --flat --moduleSourceName react-intl-wrapper --additionalComponentNames F '**/!(*.test).js'"
}
```

### App.js

```js
import { IntlProvider, localeTools } from 'react-intl-wrapper';

export default function App() {
  // This is to dynamically load language packs as needed. We don't need them all client-side.
  useEffect(() => {
    async function maybeFetchTranslations() {
      if (configuration.locale !== configuration.defaultLocale && !localeTools.isInternalLocale(configuration.locale)) {
        setTranslations((await import(`../../shared/i18n-lang-packs/${configuration.locale}`)).default);
      }
    }
    maybeFetchTranslations();
  });

  return (
    <IntlProvider defaultLocale={configuration.locale} locale={configuration.locale} messages={translations}>
      ...
    </IntlProvider>
  );
}
```

### Example language pack, `fr.js`

```js
const translations = {
  test: 'le test',
  Edit__code__and_save_to_reload_: 'Modifier {code} et enregistrer pour recharger.',
};

export default translations;
```

## Example i18n code

```js
import { defineMessages, F, useIntl } from 'react-intl-wrapper';

// For things like "alt" text and other strings not in JSX.
const messages = defineMessages({
  greeting: { msg: 'logo' },
  fallback: { msg: 'logo2' },
});

// JSX
<F
  msg="i18n pluralization test: {itemCount, plural, =0 {no items} one {# item} other {# items}}."
  values={{
    itemCount: 5000,
  }}
/>

<F
  msg="i18n html test: <a>visit our website</a> and <cta>see the world</cta>"
  values={{
    a: msg => (
      <a className="external-link" target="_blank" rel="noopener noreferrer" href="https://www.example.com/">
        {msg}
      </a>
    ),
    cta: msg => <strong>{msg}</strong>,
  }}
/>
```

## 📜 License

[MIT](license.md)

(The format is based on [Make a README](https://www.makeareadme.com/))
