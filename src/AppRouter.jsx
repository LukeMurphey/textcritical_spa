import React, { Component } from 'react';
import {
  Router, Route, Switch, withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import history from './history';
import NotFound from './components/NotFound';
import About from './components/About';
import Search from './components/Search';
import ContactMe from './components/ContactMe';
import App from './App';

class AppRouter extends Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    this.render();
  }

  // ...
  render() {
    const { inverted } = this.props;
    return (
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
            <About inverted={inverted} />
          </Route>
          <Route exact path="/search">
            <Search inverted={inverted} />
          </Route>
          <Route exact path="/contact">
            <ContactMe inverted={inverted} />
          </Route>
          <Route>
            <NotFound inverted={inverted} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

AppRouter.propTypes = {
  location: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
};

AppRouter.defaultProps = {
  inverted: true,
};

export default withRouter(AppRouter);
