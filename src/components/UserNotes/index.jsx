import React, { useState, useEffect } from "react";
import { Segment, Container, Message, Form, Input, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import { READ_WORK } from "../URLs";
import FullscreenDialog from "../FullscreenDialog";
import UserNotesTable from "../UserNotesTable";
import UserNoteEditor from "../UserNoteDialog/UserNoteEditor";
import UserNoteViewer from "../UserNoteDialog/NoteViewer";
import { deleteNote, getNotes } from "../Endpoints";
import { ENDPOINT_EXPORT_NOTES } from "../Endpoints/urls";
import ErrorMessage from "../ErrorMessage";
import UserNotesImportDialog from "../UserNotesImportDialog";
import './index.css';

export const STATE_LIST = 0;
export const STATE_VIEW = 1;
export const STATE_EDIT = 2;
export const STATE_ERROR = 3;
export const STATE_SEARCH_NO_RESULTS = 4;
export const STATE_IMPORT = 5;

export const MODAL_IMPORT = 'import';

const UserNotes = ({ inverted, history }) => {
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState(null);
  const [search, setSearch] = useState(null);
  const [appliedSearch, setAppliedSearch] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalToShow, setModalToShow] = useState(null);

  const onClickBack = () => {
    history.push(READ_WORK());
  };

  const fetchNotes = () => {
    setIsLoading(true);
    getNotes({
      onSuccess: (newData) => {
        setNotes(newData);
        setIsLoading(false);
        setAppliedSearch(search);
      },
      onError: (e) => {
        setError(e);
        setIsLoading(false);
      },
      search
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

    deleteNote({
      onSuccess: () => {
        // Reload the notes
        getNotes();
        setSelectedNote(null);
        setIsEditing(false);
        setMessage("Note successfully deleted");
      },
      onError: (data) => {
        setError(data);
      },
      noteId: note.id,
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
    setIsEditing(false);
    fetchNotes();
  };

  const onClose = () => {
    setSelectedNote(null);
    setIsEditing(false);
  }

  const onSearchChange = (_, data) => {
    setSearch(data.value);
  }

  const onSearch = () => {
    fetchNotes();
  }

  const onDialogClose = () => {
    setModalToShow(null);
  }

  const onShowImportModal = () => {
    setModalToShow(MODAL_IMPORT);
  }

  const onNotesImported = () => {
    fetchNotes();
  }

  // Load the note when opening the form
  useEffect(() => {
    fetchNotes();
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
  else if(appliedSearch && appliedSearch.length > 0 && notes && notes.length === 0) {
    state = STATE_SEARCH_NO_RESULTS;
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
            <>
              <div className="notes-options">
                <div className="primary-notes-options">
                  <Form>
                    <Input placeholder='Search...' onChange={onSearchChange} action={<Button type='submit' onClick={onSearch}>Search</Button>} />
                  </Form>
                </div>

                <div className="secondary-notes-options">
                  <Button secondary onClick={onShowImportModal}>Import Notes</Button>
                  <Button secondary onClick={() => { window.location = ENDPOINT_EXPORT_NOTES(); }}>Export Notes</Button>
                  
                </div>
              </div>

              {state === STATE_SEARCH_NO_RESULTS && (
                <Message inverted={inverted} warning>
                  <Message.Header>No Notes Match</Message.Header>
                  <p>No notes match the given search.</p>
                </Message>
              )}
              {state !== STATE_SEARCH_NO_RESULTS && (
                <UserNotesTable
                  inverted={inverted}
                  notes={notes}
                  isLoading={isLoading}
                  onSelectNote={onSelectNote}
                  showWorkLinks
                />
              )}
            </>
          )}
          { modalToShow === MODAL_IMPORT && (
            <UserNotesImportDialog onClose={onDialogClose} onNotesImported={onNotesImported} />
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
