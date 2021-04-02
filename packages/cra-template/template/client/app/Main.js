import Footer from './Footer';
import Header from './Header';
import Home from '../home/Home';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../error/404';
import React from 'react';
import ScrollToTop from './ScrollToTop';
import YourFeature from '../your_feature/YourFeature';

export default function MainApp() {
  return (
    <>
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
    </>
  );
}
