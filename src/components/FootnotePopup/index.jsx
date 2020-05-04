import React from 'react';
import PropTypes from 'prop-types';
import PopupDialog from '../PopupDialog';

const FootnoteDialog = (props) => {
  const {
    note, onClose, x, y, positionBelow, positionRight,
  } = props;

  return (
    <PopupDialog
      onClose={onClose}
      x={x}
      y={y}
      positionBelow={positionBelow}
      positionRight={positionRight}
    >
      <div>{note}</div>
    </PopupDialog>
  );
};

FootnoteDialog.propTypes = {
  note: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  positionBelow: PropTypes.bool,
  positionRight: PropTypes.bool,
};

FootnoteDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
};

export default FootnoteDialog;
