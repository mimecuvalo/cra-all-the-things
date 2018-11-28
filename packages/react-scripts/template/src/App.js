import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { Component, Suspense, lazy } from 'react';
import styles from './App.module.css';

// TODO(mime): Suspense and lazy aren't supported by ReactDOMServer yet (breaks SSR).
const IS_SERVER = typeof window !== 'undefined';
const Fallback = <div>Loading...</div>;
let SuspenseWithTemporaryWorkaround;
if (IS_SERVER) {
  const Home = lazy(() => import('./Home'));
  const About = lazy(() => import('./About'));
  const Topics = lazy(() => import('./Topics'));
  SuspenseWithTemporaryWorkaround = (
    <Suspense fallback={Fallback}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </Switch>
    </Suspense>
  );
} else {
  SuspenseWithTemporaryWorkaround = Fallback;
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <header className="App-header">
          {SuspenseWithTemporaryWorkaround}

          <ul className={styles.menu}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
            <li>
              <a href="http://localhost:9001" target="_blank" rel="noopener noreferrer">
                Styleguide
              </a>
            </li>
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
