import React, { useState, useEffect } from 'react';
import {
  Button, Header, Modal, Input, TextArea, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_NOTE, ENDPOINT_NOTE_EDIT } from "../Endpoints";
import Cookies from 'js-cookie';

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

    const formData = new FormData();
    formData.append("title", noteTitle);
    formData.append("text", noteText);
    formData.append("work", work);
    formData.append("division", division.join("/"));
    formData.append("verse", verse);

    const requestOptions = {
        method: 'POST',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken')
        },
        body: formData
    };

    fetch(ENDPOINT_NOTE_EDIT(noteId), requestOptions)
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
      <Header icon="info" content="New Note" />
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
            <Input onChange={(event, data) => setNoteTitle(data.value)} fluid placeholder='Set the title...' />

            <span>Body</span>
            <TextArea onChange={(event, data) => setNoteText(data.value)} placeholder='Put your note here...' />
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
