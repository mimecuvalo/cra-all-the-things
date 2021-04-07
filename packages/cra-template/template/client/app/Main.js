import { Route, Switch } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import Home from 'client/home/Home';
import NotFound from 'client/error/404';
import ScrollToTop from './ScrollToTop';
import YourFeature from 'client/your_feature/YourFeature';

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
