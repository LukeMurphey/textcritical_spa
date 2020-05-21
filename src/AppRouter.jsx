import React, { Suspense } from 'react';
import {
  Router, Route, Switch, withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import history from './history';
import NotFound from './components/NotFound';
import App from './App';

const ContactMe = React.lazy(() => import('./components/ContactMe'));
const About = React.lazy(() => import('./components/About'));
const Search = React.lazy(() => import('./components/Search'));
// const App = React.lazy(() => import('./App'));

const AppRouter = ({ inverted }) => (
  <Router history={history}>
    <Switch>
      <Route
        exact
        path="/work/:work?/:division0?/:division1?/:division2?/:division3?/:division4?/:leftovers?"
      >
        <App inverted={inverted} />
      </Route>
      <Route exact path="/">
        <App inverted={inverted} />
      </Route>
      <Route exact path="/about">
        <Suspense fallback={<div>Loading...</div>}>
          <About inverted={inverted} />
        </Suspense>
      </Route>
      <Route exact path="/search">
        <Suspense fallback={<div>Loading...</div>}>
          <Search inverted={inverted} />
        </Suspense>
      </Route>
      <Route exact path="/contact">
        <Suspense fallback={<div>Loading...</div>}>
          <ContactMe inverted={inverted} />
        </Suspense>
      </Route>
      <Route>
        <NotFound inverted={inverted} />
      </Route>
    </Switch>
  </Router>
);

AppRouter.propTypes = {
  inverted: PropTypes.bool,
};

AppRouter.defaultProps = {
  inverted: true,
};

export default withRouter(AppRouter);
