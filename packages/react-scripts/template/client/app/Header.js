import { F } from '../../shared/i18n';
import { Link } from 'react-router-dom';
import LoginLogoutButton from '../components/login';
import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className="App-header">
      <nav>
        <ul className={styles.menu}>
          <li>
            <Link to="/">
              <F msg="Home" />
            </Link>
          </li>
          <li>
            <Link to="/your-feature">
              <F msg="Your Feature" />
            </Link>
          </li>
        </ul>
      </nav>

      <LoginLogoutButton className={styles.login} />
    </header>
  );
}
