import './App.css';
import clientHealthCheck from './client_health_check';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from '../error/ErrorBoundary';
import Footer from './Footer';
import Header from './Header';
import Home from '../home/Home';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../error/404';
import React, { Component } from 'react';
import YourFeature from '../your_feature/YourFeature';

export default class App extends Component {
  componentDidMount() {
    clientHealthCheck();
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="App">
          <CssBaseline />
          <Header />
          <main className="App-main">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/your-feature" component={YourFeature} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }
}
