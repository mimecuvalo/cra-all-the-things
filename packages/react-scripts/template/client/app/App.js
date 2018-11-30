import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import NotFound from '../error/404';
import React, { Component, Suspense, lazy } from 'react';
import styles from './App.module.css';

// TODO(mime): Suspense and lazy aren't supported by ReactDOMServer yet (breaks SSR).
const IS_SERVER = typeof window !== 'undefined';
const Fallback = <div>Loading...</div>;
let SuspenseWithTemporaryWorkaround;
if (IS_SERVER) {
  const Home = lazy(() => import('../home/Home'));
  const YourFeature = lazy(() => import('../your_feature/Your_Feature'));
  SuspenseWithTemporaryWorkaround = (
    <Suspense fallback={Fallback}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/your-feature" component={YourFeature} />
        <Route component={NotFound} />
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
              <Link to="/your-feature">Your Feature</Link>
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
