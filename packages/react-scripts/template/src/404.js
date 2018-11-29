import React from 'react';
import styles from './Error.module.css';

function NotFound() {
  return (
    <div className={styles.message}>
      <span className={styles.emoji} role="img" aria-label="upside down face">
        🙃
      </span>
      <h1>404: not found</h1>
      <div>
        i'm sorry, dave. i'm afraid i can't do that.
        <br />
        try going back to the <a href="/">beginning</a>.
      </div>
    </div>
  );
}

export default NotFound;
