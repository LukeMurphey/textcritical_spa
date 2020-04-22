import React from 'react';
import { Button, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import WordInformation from '.';

const WordInformationDialog = (props) => {
  const {
    word, onClose, x, y,
  } = props;

  const segmentStyle = {
    top: y,
    left: x,
    position: 'absolute',
    width: 500,
    height: 300,
  };

  return (
    <Segment style={segmentStyle}>
      <WordInformation word={word} />
      <Button onClick={onClose}>Close</Button>
    </Segment>
  );
};

WordInformationDialog.propTypes = {
  word: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default WordInformationDialog;
