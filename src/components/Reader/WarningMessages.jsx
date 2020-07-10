import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const WarningMessages = ({ inverted, warnings }) => {

  // Create a custom className for signaling the desire to switch to inverted
  let classNameSuffix = "";

  if (inverted) {
    classNameSuffix = " inverted";
  }

  return (
    <>
      { warnings.map((warning) => (
        <Message
          className={classNameSuffix}
          warning
          key={warning[0]}
          header={warning[0]}
          content={warning[1]}
        />
      ))}
    </>
  )};

  WarningMessages.propTypes = {
    inverted: PropTypes.bool,
    warnings: PropTypes.arrayOf(
      PropTypes.string,
      PropTypes.string,
    ).isRequired,
  };
  
  WarningMessages.defaultProps = {
    inverted: false,
  };
  
  export default WarningMessages;
