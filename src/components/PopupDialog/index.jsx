import React from 'react';
import { Button, Segment, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './PopupDialog.scss';

/**
 * Determines a recommendation about where to show a popup.
 *
 * @param {object} event The event from the handler with the dimensions
 */
export const getPositionRecommendation = (event) => {
  const positionRight = event.clientX < (window.innerWidth / 2);
  const positionBelow = event.clientY < (window.innerHeight / 2);

  return [positionRight, positionBelow];
};

const PopupDialog = (props) => {
  const {
    children, onClose, x, y, positionBelow, positionRight, footer, inverted,
  } = props;

  /**
   * This is done to get rid of the outline around the close button and get it to show up at the
   * right of the screen.
   */
  const closeButtonStyle = {
    float: 'right',
    cursor: 'pointer',
  };

  // Correct for the cases where the dialog is off of the bottom of the screen.
  const segmentStyle = {
    position: 'absolute',
    width: 500,
    maxHeight: 300,
    overflowY: 'auto',
    padding: 0,
  };

  // This applies to the footer
  const footerStyle = {
    position: 'sticky',
    bottom: 0,
    width: '100%',
  };

  const height = segmentStyle.height ? segmentStyle.height : 200;

  if (positionBelow) {
    segmentStyle.top = y;
  } else {
    segmentStyle.top = y - height - 20;
  }

  if (positionRight) {
    segmentStyle.left = x;
  } else {
    segmentStyle.left = x - segmentStyle.width - 10;
  }

  return (
    <Segment className="popupDialog" inverted={inverted} style={segmentStyle}>
      <div style={{ padding: 15 }}>
        <Icon style={closeButtonStyle} name="close" onClick={onClose} />
        {children}
      </div>
      {footer && (
        <Segment className="popupDialogFooter" inverted={inverted} basic style={footerStyle}>{footer}</Segment>
      )}
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
  footer: PropTypes.element,
  inverted: PropTypes.bool,
};

PopupDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
  footer: null,
  inverted: false,
};

export default PopupDialog;
