import React from 'react';
import { Header, Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import WordInformation from '.';

const WordInformationDialog = (props) => {
  const { word, onClose, searchState } = props;
  return (
    <Modal defaultOpen onClose={onClose}>
      <Modal.Header>{word}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            Information on
            {word}
          </Header>
          <WordInformation word={word} searchState={searchState} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

WordInformationDialog.propTypes = {
  word: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  searchState: PropTypes.object,
};

WordInformationDialog.defaultProps = {
  searchState: null,
};

export default WordInformationDialog;
