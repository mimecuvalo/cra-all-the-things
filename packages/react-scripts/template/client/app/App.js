import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './Footer';
import Header from './Header';
import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <Header />
        <Footer />
      </div>
    );
  }
}
