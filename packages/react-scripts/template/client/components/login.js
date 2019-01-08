import Button from '@material-ui/core/Button';
import { createLock, setUser } from '../app/auth';
import { F } from '../i18n';
import React, { Component } from 'react';
import UserContext from '../app/User_Context';

export default class LoginLogoutButton extends Component {
  static contextType = UserContext;

  handleClick = () => {
    if (this.context.user) {
      setUser(undefined, this.context.setAppUser);
    } else {
      createLock().show();
    }
  };

  render() {
    return (
      <span className={this.props.className}>
        <Button variant="contained" color="primary" onClick={this.handleClick}>
          <UserContext.Consumer>{({ user }) => (user ? <F msg="Logout" /> : <F msg="Login" />)}</UserContext.Consumer>
        </Button>
      </span>
    );
  }
}
