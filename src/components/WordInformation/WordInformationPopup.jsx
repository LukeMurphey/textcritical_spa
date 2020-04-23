import React from 'react';
import { Button, Segment, Icon } from 'semantic-ui-react';
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
    overflowY: 'auto',
  };

  /**
   * This is done to get rid of the outline around the close button and get it to show up at the
   * right of the screen.
   */
  const closeButtonStyle = {
    float: 'right',
    WebkitBoxShadow: '0 0 0 0',
    boxShadow: '0 0 0 0',
  };

  return (
    <Segment style={segmentStyle}>
      <Button basic style={closeButtonStyle} icon onClick={onClose}>
        <Icon name="close" />
      </Button>
      <WordInformation word={word} />
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
