import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import React from 'react';

export default function Home() {
  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Button href="https://reactjs.org" target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
        Learn React
      </Button>
    </div>
  );
}
