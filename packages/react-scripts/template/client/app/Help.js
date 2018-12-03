import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import styles from './Help.module.css';

export default class Help extends Component {
  constructor() {
    super();

    this.state = {
      anchorEl: null,
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderStyleguide() {
    // Conditionally compile this code. Should not appear in production.
    if (process.env.NODE_ENV === 'development') {
      return (
        <MenuItem key="styleguide" onClick={this.handleClose}>
          <a href="http://localhost:9001" target="_blank" rel="noopener noreferrer" className={styles.debugLink}>
            Styleguide
          </a>
        </MenuItem>
      );
    }

    return null;
  }

  render() {
    const { anchorEl } = this.state;
    const isOpen = Boolean(anchorEl);

    return (
      <div className={styles.helpContainer}>
        <IconButton
          aria-label="Help"
          aria-owns={isOpen ? 'help-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <HelpOutlineRoundedIcon className={styles.helpIcon} />
        </IconButton>
        <Menu
          id="help-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          {this.renderStyleguide()}
        </Menu>
      </div>
    );
  }
}
