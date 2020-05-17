import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';

/**
 * This class renders the content of chapter of a work.
 */
function ErrorMessage({
  title, description, message, inverted,
}) {
  return (
    <Segment color="red" inverted={inverted}>
      <Header as="h3">{title}</Header>
      {description && (
        description
      )}
      {message && description && (
        <div style={{ marginBottom: 12 }} />
      )}
      { message }
    </Segment>
  );
}

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  message: PropTypes.string.isRequired,
  inverted: PropTypes.bool,
};

ErrorMessage.defaultProps = {
  description: null,
  inverted: false,
};

export default ErrorMessage;
