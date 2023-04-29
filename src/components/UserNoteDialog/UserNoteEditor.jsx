import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Header, Modal, Input, Form, TextArea, Message
} from 'semantic-ui-react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import ErrorMessage from '../ErrorMessage';
import NewTabLinkRewriter from './NewTabLinkRewriter';
import { editNote } from "../Endpoints";
import './index.scss';

const UserNoteEditor = ({ note, work, division, onClose, onCancel, onSave, useMarkdownEditor }) => {
  const [error, setError] = useState(null);
  const [noteTitle, setNoteTitle] = useState(note && note.title);
  const [noteText, setNoteText] = useState(note && note.text);

  const [noteTitleError, setNoteTitleError] = useState(null);
  const [noteTextError, setNoteTextError] = useState(null);

  const checkInput = (onlyClearErrors = false) => {
    let errors = 0;

    if (!noteTitle || noteTitle.length <= 0) {
      errors += 1;
      if(!onlyClearErrors){
        setNoteTitleError("The note title must be provided");
      }
    }
    else {
      setNoteTitleError(null);
    }

    if (!noteText || noteText.length <= 0) {
      errors += 1;
      if(!onlyClearErrors){
        setNoteTextError("The note text must be provided");
      }
    }
    else {
      setNoteTextError(null);
    }

    return errors === 0;
  }

  // Check the input and clear errors if the user fixed them
  useEffect(() => {
    checkInput(true);
  }, [noteTitle, noteText]);

  /**
   * Save the note.
   */
  const onSaveNote = () => {

    // Stop if their are errors
    if (!checkInput(false)){
      return;
    }

    // Stop if the form is being used to make a new note but the information is incomplete
    if((!work || !division) && (!note && !note.id)) {
      return;
    }

    editNote({
      onSuccess: (editedNote) => {
        // BTW: "!note" is used to tell the function that the note didn't exist before and should
        // therefore be considered new
        onSave(editedNote, !note);
      },
      onError: (data) => {
        setError(data);
      },
      noteId: note?.id,
      title: noteTitle,
      text:  noteText,
      work,
      reference: division.join("/"),
    });
  };

  const isEditing = note && note.id;

  const changeTitle = (newValue) => {
    // checkInput(true);
    setNoteTitle(newValue);
  }

  const changeText = (newValue) => {
    // checkInput(true);
    setNoteText(newValue);
  }

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content={isEditing ? "Edit Note" : "New Note"} />
      <Modal.Content>
        {error && (
          <ErrorMessage
            title="Unable to save the note"
            description="Unable to save the note to the server"
            message={error}
          />
        )}
        <Form>
          <div>Title</div>
          {noteTitleError && (
            <Message size="tiny" negative>{noteTitleError}</Message>
          )}
          <Input error={noteTitleError !== null} onChange={(_, data) => changeTitle(data.value)} fluid placeholder='Set the title...' value={noteTitle || ""} />

          <div className="note-content">Content</div>
          {noteTextError && (
            <Message size="tiny" negative>{noteTextError}</Message>
          )}
          {useMarkdownEditor && (
            <div data-color-mode="light">
              <MDEditor
                value={noteText || ""}
                onChange={changeText}
                highlightEnable={false}
                previewOptions={{
                  rehypeRewrite: NewTabLinkRewriter,
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />
            </div>
          )}
          {!useMarkdownEditor && (
            <TextArea error={noteTextError !== null} onChange={(_, data) => changeText(data.value)} placeholder='Put your note here...' value={noteText || ""} />
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={onSaveNote}>Save</Button>
        {onCancel && (
          <Button onClick={onCancel}>Cancel</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNoteEditor.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  note: PropTypes.object.isRequired,
  work: PropTypes.string,
  division: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  useMarkdownEditor: PropTypes.bool,
};

UserNoteEditor.defaultProps = {
  useMarkdownEditor: true,
  work: null,
  division: null,
  onCancel: null,
}

export default UserNoteEditor;
