import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core';
import classNames from 'classnames';
import Exceptions from './Exceptions';
import Forbidden from '../error/403';
import gql from 'graphql-tag';
import { Link, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import NotFound from '../error/404';
import React from 'react';
import REPL from './REPL';
import ScrollToTop from '../app/ScrollToTop';
import SystemInfo from './SystemInfo';
import Unauthorized from '../error/401';
import { useQuery } from '@apollo/react-hooks';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const USER_QUERY = gql`
  {
    user @client {
      oauth {
        email
      }
    }
  }
`;

export default function Admin() {
  const { data } = useQuery(USER_QUERY);
  const user = data?.user;

  if (!user) {
    return <Unauthorized />;
  }

  if (!user?.model?.superuser) {
    return <Forbidden />;
  }

  return <AdminApp />;
}

function AdminApp() {
  const classes = useStyles();

  return (
    <>
      <div className={classNames('notranslate', classes.root)}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem button component={Link} to="/admin">
              <ListItemText primary={'System Info'} />
            </ListItem>
            <ListItem button component={Link} to="/admin/exceptions">
              <ListItemText primary={'Exceptions'} />
            </ListItem>
            <ListItem button component={Link} to="/admin/repl">
              <ListItemText primary={'REPL'} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <ScrollToTop>
            <Switch>
              <Route path="/" component={SystemInfo} />
              <Route path="/exceptions" component={Exceptions} />
              <Route path="/repl" component={REPL} />
              <Route component={NotFound} />
            </Switch>
          </ScrollToTop>
        </main>
      </div>
    </>
  );
}
