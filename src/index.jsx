import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import NotFound from './components/NotFound';
import About from './components/About';
import ContactMe from './components/ContactMe';
import App from './App';

ReactDOM.render((
  <Router history={history}>
    <Switch>
      <Route exact path="/work/:work?/:division0?/:division1?/:division2?/:division3?/:division4?/:leftovers?">
        <App />
      </Route>
      <Route exact path="/">
        <App />
      </Route>
      <Route exact path="/about">
        <About />
      </Route>
      <Route exact path="/contact">
        <ContactMe />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  </Router>), document.getElementById('root'));
