import './App.css';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { Component, Suspense, lazy } from 'react';
import styles from './App.module.css';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));
const Topics = lazy(() => import('./Topics'));

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <CssBaseline />
          <header className="App-header">
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/topics" component={Topics} />
              </Switch>
            </Suspense>

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
      </Router>
    );
  }
}

export default App;
