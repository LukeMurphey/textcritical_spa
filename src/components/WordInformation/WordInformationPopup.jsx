import React from 'react';
import PropTypes from 'prop-types';
import WordInformation from '.';
import PopupDialog from '../PopupDialog';
import ExternalLookupLinks from './ExternalLookupLinks';

const WordInformationDialog = (props) => {
  const {
    word, onClose, x, y, positionBelow, positionRight, inverted,
  } = props;

  return (
    <PopupDialog
      onClose={onClose}
      inverted={inverted}
      x={x}
      y={y}
      positionBelow={positionBelow}
      positionRight={positionRight}
      footer={<ExternalLookupLinks word={word} />}
    >
      <WordInformation word={word} inverted={inverted} />
    </PopupDialog>
  );
};

WordInformationDialog.propTypes = {
  word: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  positionBelow: PropTypes.bool,
  positionRight: PropTypes.bool,
  inverted: PropTypes.bool,
};

WordInformationDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
  inverted: true,
};

export default WordInformationDialog;
