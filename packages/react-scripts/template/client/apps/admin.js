import App, { ScrollToTop } from '../app/App';
import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core';
import classNames from 'classnames';
import Exceptions from '../admin/Exceptions';
import { Link, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import NotFound from '../error/404';
import React from 'react';
import REPL from '../admin/REPL';
import SystemInfo from '../admin/SystemInfo';

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

export default function AdminApp(props) {
  const classes = useStyles();

  return (
    <App>
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
            <ListItem button component={Link} to="/">
              <ListItemText primary={'System Info'} />
            </ListItem>
            <ListItem button component={Link} to="/exceptions">
              <ListItemText primary={'Exceptions'} />
            </ListItem>
            <ListItem button component={Link} to="/repl">
              <ListItemText primary={'REPL'} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={SystemInfo} />
              <Route path="/exceptions" component={Exceptions} />
              <Route path="/repl" component={REPL} />
              <Route component={NotFound} />
            </Switch>
          </ScrollToTop>
        </main>
      </div>
    </App>
  );
}
