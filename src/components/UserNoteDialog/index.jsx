import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from '../ErrorMessage';
import NoteEditor from './NoteEditor';
import NotesList from './NotesList';
import { ENDPOINT_NOTES } from "../Endpoints";
import { Message } from 'semantic-ui-react'

export const STATE_LIST = 0;
export const STATE_VIEW = 1;
export const STATE_EDIT = 2;

const UserNoteDialog = ({ onClose, work, division, verse }) => {

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadedNote, setLoadedNote] = useState(null);
  const [newNote, setNewNote] = useState(false);
  const [notes, setNotes] = useState(null);

  const getNotes = () => {
    fetch(ENDPOINT_NOTES())
      .then((res) => res.json())
      .then((newData) => {
        // setLoadedNote(newData[0]);
        setNotes(newData)
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setLoadedNote(null);
  };

  const onCreateNewNote = () => {
    setIsEditing(true);
    setLoadedNote(null);
  }
  
  const onSave = (note, isNew) => {
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

    if(loadedNote) {
      state = STATE_VIEW;
    }
  }

  let children = null;

  if (error) {
    children = (
      <ErrorMessage
        title="Unable to load the note"
        description="Unable to get the note from the server"
        message={error}
      />
    )
  }

  else if (message) {
    children = (
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
            onSelectNote={(note) => setLoadedNote(note)}
            onCreateNewNote={onCreateNewNote}
            children={children}
          />
        </>
      )}
      {state === STATE_EDIT && (
        <NoteEditor note={loadedNote} work={work} division={division} verse={verse} onClose={onClose} onCancel={cancelEditing} onSave={onSave} />
      )}
      {state === STATE_VIEW && (
        <NoteEditor note={loadedNote} work={work} division={division} verse={verse} onClose={onClose} onCancel={cancelEditing} onSave={onSave} />
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
