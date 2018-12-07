import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import logo from './logo.svg';
import React, { Component } from 'react';

// This is an Apollo/GraphQL decorator for the Home component which passes the query result to the props.
@graphql(gql`
  {
    hello
  }
`)
class Home extends Component {
  render() {
    return (
      <div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
        >
          Learn React
        </Button>

        <br />
        <br />

        <Button
          href="https://graphql.org/"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
        >
          Learn {this.props.data.hello}
        </Button>
      </div>
    );
  }
}

export default Home;
