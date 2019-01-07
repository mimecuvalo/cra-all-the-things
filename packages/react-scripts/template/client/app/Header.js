import { Link } from 'react-router-dom';
import LoginLogoutButton from '../components/login';
import React, { Component } from 'react';
import styles from './Header.module.css';

export default class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <nav>
          <ul className={styles.menu}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/your-feature">Your Feature</Link>
            </li>
          </ul>
        </nav>

        <LoginLogoutButton className={styles.login} />
      </header>
    );
  }
}
