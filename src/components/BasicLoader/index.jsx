import React from 'react';
import { Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const BasicLoader = ({ inverted }) => (
  <>
    <Header
      as="h2"
      content="Loading"
      inverted={inverted}
      style={{ padding: 64 }}
      subheader="Please wait for just a moment while we fetch a few things..."
    />
  </>
);

BasicLoader.propTypes = {
  inverted: PropTypes.bool,
};

BasicLoader.defaultProps = {
  inverted: false,
};

export default BasicLoader;
