import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react'
import ErrorMessage from 'src/components/ErrorMessage';
import UserNoteEditor from 'src/components/UserNoteDialog/UserNoteEditor';
import NoteViewer from 'src/components/UserNoteDialog/NoteViewer';
import NotesList from './NotesList';
import { deleteNote, getNotes } from "src/components/Endpoints";

export const STATE_LIST = 0;
export const STATE_VIEW = 1;
export const STATE_EDIT = 2;

const Notes = ({ onClose, work, division, inverted }) => {

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadedNote, setLoadedNote] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = () => {
    setIsLoading(true);
    getNotes({
      onSuccess: (newData) => {
        setNotes(newData);
        setIsLoading(false);
      },
      onError: (e) => {
        setError(e);
        setIsLoading(false);
      },
      work,
      division: division.join("/"),
      includeRelated: true
    });
  };

  /**
   * Delete the note.
   */
  const onDeleteNote = (noteId) => {

    // eslint-disable-next-line no-restricted-globals, no-alert
    if( confirm("Are you sure you want to delete this note?") !== true ){
      return;
    }

    deleteNote({
      onSuccess: () => {
        // Reload the notes
        fetchNotes();
        setLoadedNote(null);
        setIsEditing(false);
        setMessage("Note successfully deleted");
      },
      onError: (data) => {
        setError(data);
      },
      noteId,
    })
  };

  const cancelEditOrViewing = () => {
    setIsEditing(false);
    setLoadedNote(null);
    setMessage(null);
  };

  const onCreateNewNote = () => {
    setIsEditing(true);
    setLoadedNote(null);
  }
  
  const onSave = (_, isNew) => {
    setIsEditing(false);
    setLoadedNote(null);

    if(isNew) {
      setMessage("Note successfully created");
    }
    else{
      setMessage("Note successfully edited");
    }
    
    fetchNotes();
  }

  // Load the note when opening the form
  useEffect(() => {
    fetchNotes()
  }, []);

  // Determine what state the UI ought to be in
  let state = STATE_LIST;

  if(!error) {

    if(isEditing === true) {
      state = STATE_EDIT;
    }

    else if(loadedNote) {
      state = STATE_VIEW;
    }
  }

  let topContent = null;

  if (error) {
    topContent = (
      <ErrorMessage
        title="Error"
        description="Unable to communicate with the server"
        message={error}
      />
    )
  }

  else if (message) {
    topContent = (
      <Message positive>{message}</Message>
    )
  }

  return (
    <> 
      {state === STATE_LIST && (
        <>
          <NotesList
            notes={notes}
            work={work}
            division={division}
            onClose={onClose}
            onSelectNote={(note) => { setLoadedNote(note); setMessage(null); }}
            onCreateNewNote={onCreateNewNote}
            topContent={topContent}
            isLoading={isLoading}
            inverted={inverted}
          />
        </>
      )}
      {state === STATE_EDIT && (
        <UserNoteEditor note={loadedNote} work={work} division={division} onClose={onClose} onCancel={cancelEditOrViewing} onSave={onSave} />
      )}
      {state === STATE_VIEW && (
        <NoteViewer
          note={loadedNote}
          onClose={onClose}
          onEdit={() => { setIsEditing(true); }}
          onCancel={cancelEditOrViewing}
          onDelete={(note) => { onDeleteNote(note.id) }}
        />
      )}
    </>
  );
};

Notes.defaultProps = {
  useDialog: true,
  inverted: false,
}

Notes.propTypes = {
  onClose: PropTypes.func.isRequired,
  work: PropTypes.string.isRequired,
  division: PropTypes.arrayOf(PropTypes.string).isRequired,
  useDialog: PropTypes.bool,
  inverted: PropTypes.bool,
};

export default Notes;
