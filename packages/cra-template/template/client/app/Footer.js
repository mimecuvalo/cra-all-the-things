import { Suspense, lazy } from 'react';

import { F } from 'react-intl-wrapper';
import Help from './Help';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  footer: {
    position: 'fixed',
    bottom: '0',
    right: '0',
    '& button': {
      marginLeft: '10px',
    },
  },
});

export default function Footer() {
  const styles = useStyles();

  function renderDebugMenu() {
    // Conditionally compile this code. Should not appear in production.
    if (process.env.NODE_ENV === 'development') {
      // TODO(mime): Suspense and lazy aren't supported by ReactDOMServer yet (breaks SSR).
      const IS_CLIENT = typeof window !== 'undefined';
      const Fallback = (
        <span>
          <F msg="Loading…" />
        </span>
      );
      let SuspenseWithTemporaryWorkaround;
      if (IS_CLIENT) {
        const Debug = lazy(() => import('client/internal/Debug'));
        SuspenseWithTemporaryWorkaround = (
          <Suspense fallback={Fallback}>
            <Debug />
          </Suspense>
        );
      } else {
        SuspenseWithTemporaryWorkaround = Fallback;
      }

      return SuspenseWithTemporaryWorkaround;
    }

    return null;
  }

  return (
    <footer className={styles.footer}>
      {renderDebugMenu()}
      <Help />
    </footer>
  );
}
