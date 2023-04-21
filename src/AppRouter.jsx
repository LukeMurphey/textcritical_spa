import React, { Suspense } from 'react';
import {
  Router, Route, Switch, withRouter, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import history from './history';
import NotFound from './components/NotFound';
import BasicLoader from './components/BasicLoader';
import UserNotes from './components/UserNotes';
import CookieMessage from './components/CookieMessage';

const ContactMe = React.lazy(() => import('./components/ContactMe'));
const About = React.lazy(() => import('./components/About'));
const Search = React.lazy(() => import('./components/Search'));
const BetaCodeConverter = React.lazy(() => import('./components/BetaCodeConverter'));
const App = React.lazy(() => import('./App'));
const AuthSuccess = React.lazy(() => import('./components/AuthSuccess'));

const AppRouter = ({ inverted }) => (
  <Suspense fallback={<BasicLoader inverted={inverted} />}>
    <Router history={history}>
      <Switch>
        <Route
          exact
          path="/work/:work?/:division0?/:division1?/:division2?/:division3?/:division4?/:leftovers?"
        >
          <>
            <CookieMessage inverted={inverted} />
            <App inverted={inverted} />
          </>
        </Route>
        <Route exact path="/">
          <Redirect to="/work" />
        </Route>
        <Route exact path="/about">
          <About inverted={inverted} />
        </Route>
        <Route exact path="/search">
          <Search inverted={inverted} />
        </Route>
        <Route exact path="/contact">
          <ContactMe inverted={inverted} />
        </Route>
        <Route exact path="/beta_code_converter">
          <BetaCodeConverter inverted={inverted} />
        </Route>
        <Route exact path="/auth_success">
          <AuthSuccess inverted={inverted} />
        </Route>
        <Route exact path="/notes">
          <UserNotes inverted={inverted} />
        </Route>
        <Route>
          <NotFound inverted={inverted} />
        </Route>
      </Switch>
    </Router>
  </Suspense>
);

AppRouter.propTypes = {
  inverted: PropTypes.bool,
};

AppRouter.defaultProps = {
  inverted: true,
};

export default withRouter(AppRouter);
