import { F } from 'react-intl-wrapper';
import { Route, Link } from 'react-router-dom';
import useDocumentTitle from '../app/title';

/**
 * Provides a simple React component as an example React component to manipulate out-of-the-box.
 * Has an example of some React routing.
 */
export default function YourFeature({ match }) {
  return (
    <div>
      <h2>
        <F msg="Your Feature" />
      </h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>
            <F msg="Rendering with React" />
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>
            <F msg="Components" />
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            <F msg="Props vs. State" />
          </Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => (
          <h3>
            <F msg="Please select a topic." />
          </h3>
        )}
      />
    </div>
  );
}

function Topic({ match }) {
  useDocumentTitle(match.params.topicId);

  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}
