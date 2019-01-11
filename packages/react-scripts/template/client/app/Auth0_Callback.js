import { PureComponent } from 'react';
import { createLock, setUser } from '../app/auth';
import { withRouter } from 'react-router-dom';
import UserContext from './User_Context';

class Auth0Callback extends PureComponent {
  static contextType = UserContext;

  componentDidMount() {
    const lock = createLock();
    const self = this;

    lock.on('authenticated', authResult => {
      console.log('Auth0: authenticated.');

      lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          return;
        }

        setUser({ authResult, profile }, this.context.setAppUser);

        const currentUrl = new URL(window.location.href);
        const nextUrl = currentUrl.searchParams.get('next') || '/';
        const parsedUrl = new URL(nextUrl);
        self.props.history.replace(parsedUrl.pathname + parsedUrl.search);
      });
    });
  }

  render() {
    return null;
  }
}

export default withRouter(Auth0Callback);
