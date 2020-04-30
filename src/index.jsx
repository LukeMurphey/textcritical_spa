import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';

const history = createBrowserHistory();

ReactDOM.render((<Router history={history}><Route path="/work/:work"><App /></Route></Router>), document.getElementById('root'));
