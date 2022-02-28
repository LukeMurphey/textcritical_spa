import React from 'react';
import PropTypes from 'prop-types';
import WordInformation from '.';
import PopupDialog from '../PopupDialog';
import ExternalLookupLinks from './ExternalLookupLinks';

const WordInformationDialog = (props) => {
  const {
    word, onClose, x, y, positionBelow, positionRight, inverted, work, searchState,
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
      <WordInformation work={work} word={word} inverted={inverted} searchState={searchState} />
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
  work: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  searchState: PropTypes.object,
};

WordInformationDialog.defaultProps = {
  positionBelow: true,
  positionRight: true,
  inverted: true,
  work: null,
  searchState: null,
};

export default WordInformationDialog;
