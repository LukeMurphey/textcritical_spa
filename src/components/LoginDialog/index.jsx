import React, { useState, useEffect } from 'react';
import {
  Button, Header, Modal, Placeholder,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_SOCIAL_LOGIN } from "../Endpoints";

const AboutDialog = ({ onClose }) => {

  const [authInfo, setAuthInfo] = useState(null);
  const [error, setError] = useState(null);

  const getAuthInfo = () => {
    fetch(ENDPOINT_SOCIAL_LOGIN())
      .then((res) => res.json())
      .then((newData) => {
        setAuthInfo(newData);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  useEffect(() => {
    getAuthInfo();
  }, []);

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Login" />
      <Modal.Content>
        {error && (
          <p>Eek, an error happened!</p>
        )}
        {authInfo && (
          <>
            <p>Login with Google so that you can store your list of favorite works and reading progress.</p>
            <Button
              content='Login (Google)'
              onClick={() => {
                window.location = authInfo.login_google;
              }}
            />
          </>
        )}
        {!authInfo && (
          <p><Placeholder /></p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

AboutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AboutDialog;
