import { defineMessages, F, injectIntl } from '../../shared/i18n';
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import styles from './Help.module.css';

const messages = defineMessages({
  help: { msg: 'Help' },
});

class Help extends Component {
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
          <a href="http://localhost:9001" target="_blank" rel="noopener noreferrer" className={styles.menuLink}>
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
    const helpAriaLabel = this.props.intl.formatMessage(messages.help);

    return (
      <div className={styles.helpContainer}>
        <IconButton
          aria-label={helpAriaLabel}
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
          <MenuItem key="language" onClick={this.handleLanguage}>
            <a href="/?lang=fr" className={styles.menuLink}>
              <F msg="Test language alternative" />
            </a>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default injectIntl(Help);
