import React from 'react';
import { Button, Segment, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const PopupDialog = (props) => {
  const {
    children, onClose, x, y, positionBelow, positionRight,
  } = props;

  /**
   * This is done to get rid of the outline around the close button and get it to show up at the
   * right of the screen.
   */
  const closeButtonStyle = {
    float: 'right',
    WebkitBoxShadow: '0 0 0 0',
    boxShadow: '0 0 0 0',
    paddingTop: 0,
    paddingRight: 0,
  };

  // Correct for the cases where the dialog is off of the bottom of the screen.
  const segmentStyle = {
    position: 'absolute',
    width: 500,
    height: 300,
    overflowY: 'auto',
  };

  if (positionBelow) {
    segmentStyle.top = y;
  } else {
    segmentStyle.top = y - segmentStyle.height - 20;
  }

  if (positionRight) {
    segmentStyle.left = x;
  } else {
    segmentStyle.left = x - segmentStyle.width - 10;
  }

  return (
    <Segment style={segmentStyle}>
      <Button basic style={closeButtonStyle} icon onClick={onClose}>
        <Icon name="close" />
      </Button>
      {children}
    </Segment>
  );
};

PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  positionBelow: PropTypes.bool,
  positionRight: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

PopupDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
};

export default PopupDialog;
