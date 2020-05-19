import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './history';
import AppRouter from './AppRouter';
import ErrorBoundary from './components/ErrorBoundary';
import './index.scss';

ReactDOM.render((
  <ErrorBoundary>
    <Router history={history}>
      <AppRouter />
    </Router>
  </ErrorBoundary>), document.getElementById('root'));
