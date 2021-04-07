import { Experiment, Variant } from 'client/components/Experiment';
import { F, defineMessages, useIntl } from 'react-intl-wrapper';
import { animated, useSpring } from 'react-spring';

import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import logo from './logo.svg';
import { useQuery } from '@apollo/client';

// For things like "alt" text and other strings not in JSX.
const messages = defineMessages({
  greeting: { msg: 'logo' },
  fallback: { msg: 'logo2' },
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
          msg="Edit {code} and save to reload."
          values={{
            code: <code>src/App.js</code>,
          }}
        />
      </p>

      <Button href="https://reactjs.org" target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
        <F msg="Learn React" />
      </Button>

      <br />
      <br />

      <Button href="https://graphql.org/" target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
        <F msg="Learn {data}" values={{ data: data.hello }} />
      </Button>
      <br />
      <p>
        <F
          msg="GraphQL variables test (current url path): {url}"
          values={{
            url: data.echoExample.exampleField,
          }}
          fallback={
            <F
              msg="GraphQL variables test (current url path): {url} (using i18n fallback)"
              values={{
                url: data.echoExample.exampleField,
              }}
            />
          }
        />
      </p>
      <p>
        <Experiment name="my-experiment">
          <Variant name="on">
            <F msg="Experiment enabled." />
          </Variant>
          <Variant name="off">
            <F msg="Experiment disabled" />
          </Variant>
        </Experiment>
      </p>
      <p>
        <F
          msg="i18n pluralization test: {itemCount, plural, =0 {no items} one {# item} other {# items}}."
          values={{
            itemCount: 5000,
          }}
        />
      </p>
      <p>
        <F
          msg="i18n html test: <a>visit our website</a> and <cta>see the world</cta>"
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
