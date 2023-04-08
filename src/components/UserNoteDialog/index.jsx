import React, { useState, useEffect } from 'react';
import {
  Button, Header, Modal, Input, TextArea, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_NOTE } from "../Endpoints";

const UserNoteDialog = ({ onClose, noteId, work, division, verse }) => {

  const [noteTitle, setNoteTitle] = useState(null);
  const [noteText, setNoteText] = useState(null);
  const [error, setError] = useState(null);

  const getNote = () => {
    fetch(ENDPOINT_NOTE(noteId))
      .then((res) => res.json())
      .then((newData) => {
        setNoteTitle(newData.title);
        setNoteText(newData.text);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  /**
   * Save the note.
   */
  const onSave = () => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteTitle,
            text: noteText,
            work,
            division,
            verse
        })
    };

    fetch(ENDPOINT_NOTE(noteId), requestOptions)
      .then((res) => res.json())
      .then((newData) => {
        // TODO: get note ID for new notes
        onClose(newData.noteId);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  // Load the note when opening the form
  useEffect(() => {
    if(noteId !== null) {
        getNote();
    }
  }, []);

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Note" />
      <Modal.Content>
        {error && (
          <ErrorMessage
            title="Unable to load the note"
            description="Unable to get the note from the server"
            message={error}
          />
        )}
        {!error && (
          <Form>
            <span>Title</span>
            <Input fluid placeholder='Set the title...' />

            <span>Body</span>
            <TextArea placeholder='Tell us more' />
          </Form>
        )}
      </Modal.Content>
      <Modal.Actions>
        {!error && (
          <Button primary onClick={onSave}>Save</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

UserNoteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  noteId: PropTypes.number,
  work: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  verse: PropTypes.string.isRequired,
};

UserNoteDialog.defaultProps = {
    noteId: null,
}

export default UserNoteDialog;
