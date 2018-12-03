import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './Footer';
import Header from './Header';
import Home from '../home/Home';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../error/404';
import React, { Component } from 'react';
import YourFeature from '../your_feature/Your_Feature';

export default class App extends Component {
  render() {
    return (
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
    );
  }
}
