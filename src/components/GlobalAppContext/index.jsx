import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import features from './features.json';
import { ENDPOINT_SOCIAL_LOGIN } from "../Endpoints";

export const GlobalAppContext = React.createContext({});

export const GlobalAppContextProvider = ({ children }) => {

  // This will store information about whether the user is logged in or not.
  const [authInfo, setAuthInfo] = useState({});
  const [authLoadingDone, setAuthLoadingDone] = useState(false);

  // Get information about the logged in user
  const getAuthInfo = () => {
    fetch(ENDPOINT_SOCIAL_LOGIN())
      .then((res) => res.json())
      .then((newData) => {
        setAuthInfo(newData);

        // Start getting the preferences from the server if the user is authenticated
        if (
          newData &&
          newData.authenticated &&
          Object.prototype.hasOwnProperty.call(newData, "csrf_token")
        ) {
          getPreferences(newData.csrf_token);
        } else {
          setAuthLoadingDone(true);
        }
      })
      .catch(() => {
        setAuthLoadingDone(true);
      });
  };

  // Get the authentication information
  useEffect(() => {
    getAuthInfo();
  }, []);

  const checkAuthenticationState = () => {
    setAuthLoadingDone(false);
    getAuthInfo();
  }

  return (
    <GlobalAppContext.Provider value={ { features, authentication: { authLoadingDone, ...authInfo, checkAuthenticationState } }}>
      {children}
    </GlobalAppContext.Provider>
  );
};

GlobalAppContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default GlobalAppContextProvider;
