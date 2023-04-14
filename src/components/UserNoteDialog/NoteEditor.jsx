import React, { useState } from 'react';
import PropTypes from 'prop-types'; import {
  Button, Header, Modal, Input, TextArea, Form,
} from 'semantic-ui-react';
import Cookies from 'js-cookie';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_NOTE_EDIT } from "../Endpoints";

const UserNoteEdit = ({ note, onClose, work, division, verse }) => {
  const [error, setError] = useState(null);
  const [noteTitle, setNoteTitle] = useState(note.fields.title);
  const [noteText, setNoteText] = useState(note.fields.text);

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

    fetch(ENDPOINT_NOTE_EDIT(note.pk), requestOptions)
      .then((res) => res.json())
      .then((newData) => {
        // TODO: get note ID for new notes
        onClose(newData.pk);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

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
        <Form>
          <span>Title</span>
          <Input onChange={(event, data) => setNoteTitle(data.value)} fluid placeholder='Set the title...' value={note.fields.title} />

          <span>Body</span>
          <TextArea onChange={(event, data) => setNoteText(data.value)} placeholder='Put your note here...' value={note.fields.text} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={onSave}>Save</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNoteEdit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  note: PropTypes.object.isRequired,
  work: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  verse: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserNoteEdit;
