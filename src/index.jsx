import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Switch>
      <Route exact path="/work/:work">
        <App />
      </Route>
      <Route exact path="/work/">
        <App />
      </Route>
      <Route path="/">
        <App />
      </Route>
    </Switch>
  </Router>), document.getElementById('root'));
