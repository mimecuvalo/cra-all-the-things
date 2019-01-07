import './App.css';
import Auth0Callback from './Auth0_Callback';
import clientHealthCheck from './client_health_check';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from '../error/ErrorBoundary';
import Footer from './Footer';
import { getUser } from './auth';
import Header from './Header';
import Home from '../home/Home';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../error/404';
import React, { Component } from 'react';
import UserContext from './User_Context';
import YourFeature from '../your_feature/YourFeature';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userContext: {
        user: props.ssrUser || getUser(),
        setAppUser: this.setAppUser,
      },
    };
  }

  setAppUser = user => {
    this.setState({
      userContext: {
        user,
        setAppUser: this.setAppUser,
      },
    });
  };

  componentDidMount() {
    clientHealthCheck();
  }

  render() {
    return (
      <UserContext.Provider value={this.state.userContext}>
        <ErrorBoundary>
          <div className="App">
            <CssBaseline />
            <Header />
            <main className="App-main">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/your-feature" component={YourFeature} />
                <Route exact path="/auth0-callback" component={Auth0Callback} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  }
}
