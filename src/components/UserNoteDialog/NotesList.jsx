import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button } from 'semantic-ui-react';
import UserNotesTable from '../UserNotesTable';
import './NotesList.scss';

const UserNotesList = ({ notes, onClose, onSelectNote, onCreateNewNote, topContent, isLoading }) => {

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Notes" />
      <Modal.Content>
        {topContent}
        <UserNotesTable
          notes={notes}
          isLoading={isLoading}
          onSelectNote={onSelectNote}
          onCreateNewNote={onCreateNewNote}
          showWorkLinks
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNotesList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectNote: PropTypes.func.isRequired,
  onCreateNewNote: PropTypes.func.isRequired,
  topContent: PropTypes.element,
  isLoading: PropTypes.bool,
};

UserNotesList.defaultProps = {
  topContent: null,
  isLoading: false,
}

export default UserNotesList;
