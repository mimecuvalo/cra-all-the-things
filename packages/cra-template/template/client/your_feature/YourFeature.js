import { Link, Route } from 'react-router-dom';

import { F } from 'shared/util/i18n';
import useDocumentTitle from 'client/app/title';

/**
 * Provides a simple React component as an example React component to manipulate out-of-the-box.
 * Has an example of some React routing.
 */
export default function YourFeature({ match }) {
  return (
    <div>
      <h2>
        <F defaultMessage="Your Feature" />
      </h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>
            <F defaultMessage="Rendering with React" />
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>
            <F defaultMessage="Components" />
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            <F defaultMessage="Props vs. State" />
          </Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => (
          <h3>
            <F defaultMessage="Please select a topic." />
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
