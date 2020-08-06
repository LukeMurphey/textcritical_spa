import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Reader from './components/Reader';

const App = ({ inverted }) => (
  <Reader
    inverted={inverted}
  />
)

App.propTypes = {
  inverted: PropTypes.bool,
};

App.defaultProps = {
  inverted: false,
};

export default withRouter(App);
