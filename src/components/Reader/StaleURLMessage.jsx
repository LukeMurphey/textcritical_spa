import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StaleURLMessage = ({ inverted }) => {

  // Create a custom className for signaling the desire to switch to inverted
  let classNameSuffix = "";

  if (inverted) {
    classNameSuffix = " inverted";
  }

  return (
    <Message info className={classNameSuffix}>
      <p>
        The URL you were using was old so you were redirected to
        the new one. You may want to update your shortcuts.
      </p>
    </Message>
  );
};

StaleURLMessage.propTypes = {
  inverted: PropTypes.bool,
};

StaleURLMessage.defaultProps = {
  inverted: false,
};

export default StaleURLMessage;
