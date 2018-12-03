import A11y from './A11y';
import Performance from './Performance';
import React, { Component } from 'react';
import styles from './Debug.module.css';

export default class DebugTray extends Component {
  render() {
    return (
      <div className={styles.debug}>
        <A11y />
        <Performance />
      </div>
    );
  }
}
