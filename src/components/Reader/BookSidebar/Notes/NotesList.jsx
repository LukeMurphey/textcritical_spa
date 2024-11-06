import React from 'react';
import PropTypes from 'prop-types';
import UserNotesTable from '../UserNotesTable';
import './NotesList.scss';

const UserNotesList = ({ notes, onClose, onSelectNote, onCreateNewNote, topContent, isLoading, useDialog, inverted }) => {

  const getContent = () => {
    return (
      <>
        {topContent}
        <UserNotesTable
          notes={notes}
          isLoading={isLoading}
          onSelectNote={onSelectNote}
          onCreateNewNote={onCreateNewNote}
          inverted={inverted}
        />
      </>
      )
  }

  return getContent();
};

UserNotesList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  onSelectNote: PropTypes.func.isRequired,
  onCreateNewNote: PropTypes.func.isRequired,
  topContent: PropTypes.element,
  isLoading: PropTypes.bool,
  useDialog: PropTypes.bool,
  inverted: PropTypes.bool,
};

UserNotesList.defaultProps = {
  topContent: null,
  isLoading: false,
  notes: null,
  useDialog: true,
  inverted: false,
}

export default UserNotesList;
