import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import NotFound from './components/NotFound';
import About from './components/About';
import Search from './components/Search';
import ContactMe from './components/ContactMe';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import './index.scss';

ReactDOM.render((
  <ErrorBoundary>
    <Router history={history}>
      <Switch>
        <Route exact path="/work/:work?/:division0?/:division1?/:division2?/:division3?/:division4?/:leftovers?">
          <App inverted />
        </Route>
        <Route exact path="/">
          <App inverted />
        </Route>
        <Route exact path="/about">
          <About inverted />
        </Route>
        <Route exact path="/search">
          <Search inverted />
        </Route>
        <Route exact path="/contact">
          <ContactMe inverted />
        </Route>
        <Route>
          <NotFound inverted />
        </Route>
      </Switch>
    </Router>
  </ErrorBoundary>), document.getElementById('root'));
