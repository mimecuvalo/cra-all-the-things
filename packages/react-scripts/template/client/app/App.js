import './App.css';
import classNames from 'classnames';
import clientHealthCheck from './client_health_check';
import CloseIcon from '@material-ui/icons/Close';
import { defineMessages, useIntl } from 'react-intl-wrapper';
import ErrorBoundary from '../error/ErrorBoundary';
import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useRef, useState } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';

const messages = defineMessages({
  close: { msg: 'Close' },
});

// This is the main entry point on the client-side.
export default function App(props) {
  const [devOnlyHiddenOnLoad, setDevOnlyHiddenOnLoad] = useState(process.env.NODE_ENV === 'development');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      return;
    }

    // Remove MaterialUI's SSR generated CSS.
    const jssStyles = document.getElementById('jss-ssr');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    // Upon starting the app, kick off a client health check which runs periodically.
    clientHealthCheck();

    setDevOnlyHiddenOnLoad(false);
    setLoaded(true);
  }, [devOnlyHiddenOnLoad, loaded]);

  // XXX(all-the-things): we can't get rid of FOUC in dev mode because we want hot reloading of CSS updates.
  // This hides the unsightly unstyled app. However, in dev mode, it removes the perceived gain of SSR. :-/
  const devOnlyHiddenOnLoadStyle = devOnlyHiddenOnLoad ? { opacity: 0 } : null;

  return (
    <SnackbarProvider action={<CloseButton />}>
      <ErrorBoundary>
        <div
          className={classNames('App', {
            'App-logged-in': true,
            'App-is-development': process.env.NODE_ENV === 'development',
          })}
          style={devOnlyHiddenOnLoadStyle}
        >
          {props.children}
        </div>
      </ErrorBoundary>
    </SnackbarProvider>
  );
}

function CloseButton(snackKey) {
  const intl = useIntl();
  const snackbar = useSnackbar();
  const closeAriaLabel = intl.formatMessage(messages.close);

  return (
    <IconButton
      key="close"
      onClick={() => snackbar.closeSnackbar(snackKey)}
      className="App-snackbar-icon"
      color="inherit"
      aria-label={closeAriaLabel}
    >
      <CloseIcon />
    </IconButton>
  );
}

export function ScrollToTop({ children }) {
  const routerLocation = useLocation();
  const prevLocationPathname = useRef();

  useEffect(() => {
    if (routerLocation.pathname !== prevLocationPathname) {
      window.scrollTo(0, 0);
    }
    prevLocationPathname.current = routerLocation.pathname;
  });

  return children;
}
