import React, { useState } from 'react';
import PropTypes from 'prop-types'; import {
  Button, Header, Modal, Input, TextArea, Form,
} from 'semantic-ui-react';
import Cookies from 'js-cookie';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_NOTE_EDIT } from "../Endpoints";

const UserNoteEditor = ({ note, work, division, verse, onClose, onCancel, onSave }) => {
  const [error, setError] = useState(null);
  const [noteTitle, setNoteTitle] = useState(note && note.fields && note.fields.title);
  const [noteText, setNoteText] = useState(note && note.fields && note.fields.text);

  /**
   * Save the note.
   */
  const onSaveNote = () => {

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

    fetch(ENDPOINT_NOTE_EDIT(note?.pk), requestOptions)
      .then((res) => res.json())
      .then((editedNote) => {
        // BTW: "!note" is used to tell the function that the note didn't exist before and should
        // therefore be considered new
        onSave(editedNote, !note);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  const isEditing = note && note.pk;

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content={isEditing ? "Edit Note" : "New Note"} />
      <Modal.Content>
        {error && (
          <ErrorMessage
            title="Unable to save the note"
            description="Unable to get save note to the server"
            message={error}
          />
        )}
        <Form>
          <span>Title</span>
          <Input onChange={(_, data) => setNoteTitle(data.value)} fluid placeholder='Set the title...' value={noteTitle || ""} />

          <span>Body</span>
          <TextArea onChange={(_, data) => setNoteText(data.value)} placeholder='Put your note here...' value={noteText || ""} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={onSaveNote}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNoteEditor.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  note: PropTypes.object.isRequired,
  work: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  verse: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default UserNoteEditor;
