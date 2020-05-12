import React from 'react';
import { Button, Segment, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
    children, onClose, x, y, positionBelow, positionRight, footer,
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
    maxHeight: 300,
    overflowY: 'auto',
    padding: 0,
  };

  // This applies to the footer
  const footerStyle = {
    position: 'sticky',
    bottom: 0,
    width: '100%',
    borderTop: '1px solid #DDD',
    backgroundColor: '#F6F6F6',
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
    <Segment style={segmentStyle}>
      <div style={{ padding: 15 }}>
        <Button basic style={closeButtonStyle} icon onClick={onClose}>
          <Icon name="close" />
        </Button>
        {children}
      </div>
      {footer && (
        <Segment basic style={footerStyle}>{footer}</Segment>
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
};

PopupDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
  footer: null,
};

export default PopupDialog;
