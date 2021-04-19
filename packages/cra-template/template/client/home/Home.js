import { Experiment, Variant } from 'client/components/Experiment';
import { F, defineMessages, useIntl } from 'shared/util/i18n';
import { animated, useSpring } from 'react-spring';

import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import logo from './logo.svg';
import { useQuery } from '@apollo/client';

// For things like "alt" text and other strings not in JSX.
const messages = defineMessages({
  greeting: { defaultMessage: 'logo' },
  fallback: { defaultMessage: 'logo2' },
});

// This is an GraphQL query for the Home component which passes the query result to the props.
// It's a more complex example that lets you grab the props value of the component you're looking at.
const HELLO_AND_ECHO_QUERY = gql`
  query helloAndEchoQueries($str: String!) {
    echoExample(str: $str) {
      exampleField
    }

    hello
  }
`;

export default function Home({ match: { url } }) {
  const intl = useIntl();

  // This uses React Spring: https://www.react-spring.io/
  // Gives you some great animation easily for your app.
  const springProps = useSpring({
    opacity: 1,
    top: 0,
    from: { opacity: 0, top: 50 },
  });

  const { loading, data } = useQuery(HELLO_AND_ECHO_QUERY, {
    variables: { str: url },
  });

  if (loading) {
    return null;
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return <div>Running offline with service worker.</div>;
  }

  const logoAltText = intl.formatMessage(messages.greeting, undefined /* values */, messages.fallback);

  return (
    <div>
      <animated.div style={{ position: 'relative', ...springProps }}>
        <img src={logo} className="App-logo" alt={logoAltText} />
      </animated.div>
      <p>
        <F
          defaultMessage="Edit {code} and save to reload."
          values={{
            code: <code>src/App.js</code>,
          }}
        />
      </p>

      <Button href="https://reactjs.org" target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
        <F defaultMessage="Learn React" />
      </Button>

      <br />
      <br />

      <Button href="https://graphql.org/" target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
        <F defaultMessage="Learn {data}" values={{ data: data.hello }} />
      </Button>
      <br />
      <p>
        <F
          defaultMessage="GraphQL variables test (current url path): {url}"
          values={{
            url: data.echoExample.exampleField,
          }}
        />
      </p>
      <p>
        <Experiment name="my-experiment">
          <Variant name="on">
            <F defaultMessage="Experiment enabled." />
          </Variant>
          <Variant name="off">
            <F defaultMessage="Experiment disabled" />
          </Variant>
        </Experiment>
      </p>
      <p>
        <F
          defaultMessage="i18n pluralization test: {itemCount, plural, =0 {no items} one {# item} other {# items}}."
          values={{
            itemCount: 5000,
          }}
        />
      </p>
      <p>
        <F
          defaultMessage="i18n html test: <a>visit our website</a> and <cta>see the world</cta>"
          values={{
            a: (msg) => (
              <a className="external-link" target="_blank" rel="noopener noreferrer" href="https://www.example.com/">
                {msg}
              </a>
            ),
            cta: (msg) => <strong>{msg}</strong>,
          }}
        />
      </p>
    </div>
  );
}
