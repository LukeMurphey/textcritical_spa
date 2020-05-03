import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import NotFound from './components/NotFound';
import App from './App';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Switch>
      <Route exact path="/work/:work?/:division0?/:division1?/:division2?/:division3?/:division4?/:leftovers?">
        <App />
      </Route>
      <Route exact path="/">
        <App />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  </Router>), document.getElementById('root'));

/*
ReactDOM.render((
  <Router history={history}>
    <Switch>
      <Route path="/work">
        <App />
      </Route>
      <Route path="/work/:work?/:division0?/:division1?/:division2?/:division3?/:division4?/:leftovers?">
        <App />
      </Route>
      <Route path="/">
        <App />
      </Route>
    </Switch>
  </Router>), document.getElementById('root'));
*/

