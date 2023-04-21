import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Message } from 'semantic-ui-react'
import ErrorMessage from '../ErrorMessage';
import UserNoteEditor from './UserNoteEditor';
import NoteViewer from './NoteViewer';
import NotesList from './NotesList';
import { ENDPOINT_NOTES, ENDPOINT_NOTE_DELETE } from "../Endpoints";

export const STATE_LIST = 0;
export const STATE_VIEW = 1;
export const STATE_EDIT = 2;

const UserNoteDialog = ({ onClose, work, division, verse }) => {

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadedNote, setLoadedNote] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getNotes = () => {
    setIsLoading(true);
    fetch(ENDPOINT_NOTES(work, division.join("/")))
      .then((res) => res.json())
      .then((newData) => {
        setNotes(newData)
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
  const onDeleteNote = (noteId) => {

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

    fetch(ENDPOINT_NOTE_DELETE(noteId), requestOptions)
      .then((res) => res.json())
      .then(() => {
        // Reload the notes
        getNotes();
        setLoadedNote(null);
        setIsEditing(false);
        setMessage("Note successfully deleted");
      })
      .catch((e) => {
        setError(e.toString());
      });
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
    
    getNotes();
  }

  // Load the note when opening the form
  useEffect(() => {
    getNotes()
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
            verse={verse}
            onClose={onClose}
            onSelectNote={(note) => { setLoadedNote(note); setMessage(null); }}
            onCreateNewNote={onCreateNewNote}
            topContent={topContent}
            isLoading={isLoading}
          />
        </>
      )}
      {state === STATE_EDIT && (
        <UserNoteEditor note={loadedNote} work={work} division={division} verse={verse} onClose={onClose} onCancel={cancelEditOrViewing} onSave={onSave} />
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

UserNoteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  work: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  verse: PropTypes.string.isRequired,
};

export default UserNoteDialog;
