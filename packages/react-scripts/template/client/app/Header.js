import Home from '../home/Home';
import { Link, Route, Switch } from 'react-router-dom';
import NotFound from '../error/404';
import React, { Component } from 'react';
import styles from './Header.module.css';
import YourFeature from '../your_feature/Your_Feature';

export default class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/your-feature" component={YourFeature} />
          <Route component={NotFound} />
        </Switch>

        <ul className={styles.menu}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/your-feature">Your Feature</Link>
          </li>
        </ul>
      </header>
    );
  }
}
