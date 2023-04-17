import React, { useState, useEffect } from "react";
import { Segment, Container, Message } from "semantic-ui-react";
import Cookies from 'js-cookie';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { READ_WORK } from "../URLs";
import FullscreenDialog from "../FullscreenDialog";
import UserNotesTable from "../UserNotesTable";
import UserNoteEditor from "../UserNoteDialog/UserNoteEditor";
import UserNoteViewer from "../UserNoteDialog/NoteViewer";
import { ENDPOINT_NOTES, ENDPOINT_NOTE_DELETE } from "../Endpoints";
import ErrorMessage from "../ErrorMessage";

export const STATE_LIST = 0;
export const STATE_VIEW = 1;
export const STATE_EDIT = 2;
export const STATE_ERROR = 3;

const UserNotes = ({ inverted, history }) => {
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const onClickBack = () => {
    history.push(READ_WORK());
  };

  const getNotes = () => {
    setIsLoading(true);
    fetch(ENDPOINT_NOTES())
      .then((res) => res.json())
      .then((newData) => {
        setNotes(newData);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.toString());
        setIsLoading(false);
      });
  };
  
  /**
   * Delete the note.
   */
  const onDelete = (note) => {

    // eslint-disable-next-line no-restricted-globals, no-alert
    if( confirm("Are you sure you want to delete this note?") !== true ){
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    };

    fetch(ENDPOINT_NOTE_DELETE(note.pk), requestOptions)
      .then((res) => res.json())
      .then(() => {
        // Reload the notes
        getNotes();
        setSelectedNote(null);
        setIsEditing(false);
        setMessage("Note successfully deleted");
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  const onEdit = () => {
    setIsEditing(true);
  }

  const onSelectNote = (note) => {
    setSelectedNote(note);
  };

  const onSave = () => {
    setSelectedNote(null);
    getNotes();
  };

  const onClose = () => {
    setSelectedNote(null);
    setIsEditing(false);
  }

  // Load the note when opening the form
  useEffect(() => {
    getNotes();
  }, []);

  let state = STATE_LIST

  if (error) {
    state = STATE_ERROR;
  }
  else if (selectedNote && isEditing) {
    state = STATE_EDIT;
  }
  else if (selectedNote && !isEditing) {
    state = STATE_VIEW;
  }
  else if (notes && notes.length > 0) {
    state = STATE_LIST;
  }

  return (
    <FullscreenDialog
      inverted={inverted}
      onClickBack={onClickBack}
      backTitle="Back to the Library"
    >
      <Container>
        <Segment inverted={inverted}>
          {state === STATE_ERROR && (
            <ErrorMessage
              title="Error"
              description="Unable to communicate with the server"
              message={error}
              inverted={inverted}
            />
          )}
          {message && (
            <Message inverted={inverted} positive>{message}</Message>
          )}
          {state === STATE_VIEW && (
            <UserNoteViewer
              note={selectedNote}
              onClose={onClose}
              onSave={onSave}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          )}
          {state === STATE_EDIT && (
            <UserNoteEditor
              note={selectedNote}
              onClose={onClose}
              onSave={onSave}
            />
          )}
          {state !== STATE_ERROR && (
            <UserNotesTable
              inverted={inverted}
              notes={notes}
              isLoading={isLoading}
              onSelectNote={onSelectNote}
            />
          )}
        </Segment>
      </Container>
    </FullscreenDialog>
  );
};

UserNotes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
};

UserNotes.defaultProps = {
  inverted: false,
};

UserNotes.defaultProps = {
  inverted: false,
};

export default withRouter(UserNotes);
