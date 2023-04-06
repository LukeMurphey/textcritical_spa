import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Reader from './components/Reader';
import { FeatureFlagsProvider } from "./components/FeatureFlags";

const App = ({ inverted }) => (
  <FeatureFlagsProvider>
    <Reader
      inverted={inverted}
    />
  </FeatureFlagsProvider>
)

App.propTypes = {
  inverted: PropTypes.bool,
};

App.defaultProps = {
  inverted: false,
};

export default withRouter(App);
