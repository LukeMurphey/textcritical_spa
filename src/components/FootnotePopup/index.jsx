import React from 'react';
import PropTypes from 'prop-types';
import PopupDialog from '../PopupDialog';

const FootnoteDialog = (props) => {
  const {
    notes, onClose, x, y, positionBelow, positionRight, inverted,
  } = props;

  return (
    <PopupDialog
      onClose={onClose}
      inverted={inverted}
      x={x}
      y={y}
      positionBelow={positionBelow}
      positionRight={positionRight}
    >
      <div>
        {notes.map((note, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>{note}</div>
        ))}
      </div>
    </PopupDialog>
  );
};

FootnoteDialog.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  positionBelow: PropTypes.bool,
  positionRight: PropTypes.bool,
  inverted: PropTypes.bool,
};

FootnoteDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
  inverted: false,
};

export default FootnoteDialog;
