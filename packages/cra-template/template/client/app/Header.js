import { createUseStyles } from 'react-jss';
import { F } from 'react-intl-wrapper';
import { Link } from 'react-router-dom';
import LoginLogoutButton from '../components/login';
import React from 'react';

const useStyles = createUseStyles({
  menu: {
    position: 'fixed',
    top: '10px',
    left: '10px',
  },
  login: {
    display: 'block',
    position: 'fixed',
    top: '10px',
    right: '10px',
  },
});

export default function Header() {
  const styles = useStyles();

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
