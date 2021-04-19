import { F } from 'shared/util/i18n';
import { Link } from 'react-router-dom';
import LoginLogoutButton from 'client/components/login';
import { createUseStyles } from 'react-jss';

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
              <F defaultMessage="Home" />
            </Link>
          </li>
          <li>
            <Link to="/your-feature">
              <F defaultMessage="Your Feature" />
            </Link>
          </li>
        </ul>
      </nav>

      <LoginLogoutButton className={styles.login} />
    </header>
  );
}
