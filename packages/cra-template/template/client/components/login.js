import Button from '@material-ui/core/Button';
import { createLock, setUser } from '../app/auth';
import { F } from 'react-intl-wrapper';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const USER_QUERY = gql`
  {
    user @client {
      oauth {
        email
      }
    }
  }
`;

export default function LoginLogoutButton({ className }) {
  const { data } = useQuery(USER_QUERY);
  const user = data?.user;

  const handleClick = () => {
    if (user) {
      setUser(undefined);
    } else {
      createLock().show();
    }
  };

  return (
    <span className={className}>
      <Button variant="contained" color="primary" onClick={handleClick}>
        {user ? <F msg="Logout" /> : <F msg="Login" />}
      </Button>
    </span>
  );
}
