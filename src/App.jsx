import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Portal, Container } from "semantic-ui-react";
import { SemanticToastContainer } from 'react-semantic-toasts';
import Reader from './components/Reader';
import { GlobalAppContextProvider } from "./components/GlobalAppContext";

const App = ({ inverted }) => (
  <GlobalAppContextProvider>
    <Portal open={true}>
      <Container
        style={{
          left: 'calc(100% - 420px)',
          position: 'fixed',
          top: 'calc(100% - 140px)',
          zIndex: 1000,
          width: 400,
        }}
          >
        <SemanticToastContainer position="bottom-right" />
      </Container>
    </Portal>
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
