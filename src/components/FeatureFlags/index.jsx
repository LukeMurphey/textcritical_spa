import React from 'react';
import PropTypes from 'prop-types';
import features from './features.json';

export const FeatureFlags = React.createContext({});

export const FeatureFlagsProvider = ({ children }) => {
  return (
    <FeatureFlags.Provider value={{ features }}>
      {children}
    </FeatureFlags.Provider>
  );
};

FeatureFlagsProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default FeatureFlagsProvider;

