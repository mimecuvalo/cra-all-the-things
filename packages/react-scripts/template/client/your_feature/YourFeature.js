import { F } from '../../shared/i18n';
import { Route, Link } from 'react-router-dom';
import React from 'react';

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
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}
