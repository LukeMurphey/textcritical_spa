import React from 'react';
import { Segment, Icon, Portal } from 'semantic-ui-react';
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

const PopupDialog = ({ children, onClose, x, y, positionBelow, positionRight, footer, width, maxHeight, inverted}) => {

  /**
   * This is done to get rid of the outline around the close button and get it to show up at the
   * right of the screen.
   */
  const closeButtonStyle = {
    float: 'right',
    cursor: 'pointer',
    marginRight: 0,
  };

  // Correct for the cases where the dialog is off of the bottom of the screen.
  const segmentStyle = {
    position: 'absolute',
    width,
    maxHeight,
    overflowY: 'auto',
    padding: 0,
    zIndex: 103,
  };

  const segmentStyleTinyTop = {
    ...segmentStyle,
    ...{
      top: 45,
      left: 5,
      width: 'calc(100% - 10px)',
      position: 'fixed',
    },
  };

  const segmentStyleTinyBelow = {
    ...segmentStyle,
    ...{
      bottom: 5,
      left: 5,
      width: 'calc(100% - 10px)',
      position: 'fixed',
    },
  };

  // Determine if we ought to enter the mode for mobile devices
  const isSmallMode = () => window.innerWidth < 1024;

  // Get the style appropriate for the segment to appear
  const getSegmentStyle = () => {
    if (isSmallMode()) {
      if (positionBelow) {
        return segmentStyleTinyBelow;
      }
      return segmentStyleTinyTop;
    }

    return segmentStyle;
  };

  // This applies to the footer
  const footerStyle = {
    position: 'sticky',
    bottom: 0,
    width: '100%',
  };

  // Get the main content for the popup
  const getContent = () => (
    <Segment className="popupDialog" inverted={inverted} style={getSegmentStyle()}>
      <div style={{ padding: 15 }}>
        <Icon style={closeButtonStyle} onClick={onClose}>&#10005;</Icon>
        {children}
      </div>
      {footer && (
        <Segment className="popupDialogFooter" inverted={inverted} basic style={footerStyle}>{footer}</Segment>
      )}
    </Segment>
  );

  // Determine the height of the dialog
  const height = segmentStyle.height ? segmentStyle.height : maxHeight;

  // Calculate the vertical position
  if (positionBelow) {
    segmentStyle.top = y;
  } else {
    segmentStyle.top = y - height - 20;
  }

  // Calculate the horizontal position
  if (positionRight) {
    segmentStyle.left = x;
  } else {
    segmentStyle.left = x - segmentStyle.width - 10;
  }

  // If we are running in small mode, run it as a portal so that it can appear in a fixed location
  if (isSmallMode()) {
    return (
      <Portal open>
        {getContent()}
      </Portal>
    );
  }

  // Otherwise, run it inline so that it is fixed in the rest of the content
  return getContent();
};

PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  positionBelow: PropTypes.bool,
  positionRight: PropTypes.bool,
  width: PropTypes.number,
  maxHeight: PropTypes.number,
  children: PropTypes.element.isRequired,
  footer: PropTypes.element,
  inverted: PropTypes.bool,
};

PopupDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
  width: 500,
  maxHeight: 300,
  footer: null,
  inverted: false,
};

export default PopupDialog;
