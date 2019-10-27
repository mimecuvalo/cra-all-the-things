import './App.css';
import classNames from 'classnames';
import clientHealthCheck from './client_health_check';
import CloseIcon from '@material-ui/icons/Close';
import { defineMessages, useIntl } from '../../shared/i18n';
import ErrorBoundary from '../error/ErrorBoundary';
import Footer from './Footer';
import Header from './Header';
import Home from '../home/Home';
import IconButton from '@material-ui/core/IconButton';
import { Route, Switch, useLocation } from 'react-router-dom';
import NotFound from '../error/404';
import React, { Component, useEffect, useRef } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import UserContext from './User_Context';
import YourFeature from '../your_feature/YourFeature';

const messages = defineMessages({
  close: { msg: 'Close' },
});

// This is the main entry point on the client-side.
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userContext: {
        user: props.user,
      },
      devOnlyHiddenOnLoad: process.env.NODE_ENV === 'development',
    };
  }

  componentDidMount() {
    // Remove MaterialUI's SSR generated CSS.
    const jssStyles = document.getElementById('jss-ssr');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    // Upon starting the app, kick off a client health check which runs periodically.
    clientHealthCheck();

    this.setState({ devOnlyHiddenOnLoad: false });
  }

  render() {
    // HACK(all-the-things): we can't get rid of FOUC in dev mode because we want hot reloading of CSS updates.
    // This hides the unsightly unstyled app. However, in dev mode, it removes the perceived gain of SSR. :-/
    const devOnlyHiddenOnLoadStyle = this.state.devOnlyHiddenOnLoad ? { opacity: 0 } : null;

    return (
      <UserContext.Provider value={this.state.userContext}>
        <SnackbarProvider action={closeAction}>
          <ErrorBoundary>
            <div className={classNames('App', { 'App-logged-in': this.props.user })} style={devOnlyHiddenOnLoadStyle}>
              <Header />
              <main className="App-main">
                <ScrollToTop>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/your-feature" component={YourFeature} />
                    <Route component={NotFound} />
                  </Switch>
                </ScrollToTop>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </SnackbarProvider>
      </UserContext.Provider>
    );
  }
}

function CloseButton({ snackKey }) {
  const intl = useIntl();
  const snackbar = useSnackbar();

  const closeAriaLabel = intl.formatMessage(messages.close);
  return (
    <IconButton
      key="close"
      onClick={() => {
        snackbar.closeSnackbar(snackKey);
      }}
      className="App-snackbar-icon"
      color="inherit"
      aria-label={closeAriaLabel}
    >
      <CloseIcon />
    </IconButton>
  );
}
const closeAction = key => <CloseButton snackKey={key} />;

function ScrollToTop({ children }) {
  const location = useLocation();
  const prevLocationPathname = useRef();

  useEffect(() => {
    if (location.pathname !== prevLocationPathname) {
      window.scrollTo(0, 0);
    }
    prevLocationPathname.current = location.pathname;
  });

  return children;
}

export default App;
