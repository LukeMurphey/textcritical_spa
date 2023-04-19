import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Reader from './components/Reader';
import { GlobalAppContextProvider } from "./components/GlobalAppContext";

const App = ({ inverted }) => (
    <GlobalAppContextProvider>
      <Reader
        inverted={inverted}
      />
    </GlobalAppContextProvider>
)

App.propTypes = {
  inverted: PropTypes.bool,
};

App.defaultProps = {
  inverted: false,
};

export default withRouter(App);
