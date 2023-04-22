import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Header, Button, Segment, Icon, Progress } from "semantic-ui-react";
import { parse } from "papaparse";
import {useDropzone} from 'react-dropzone';
import Cookies from 'js-cookie';
import { ENDPOINT_NOTE_EDIT } from "../Endpoints";
import regeneratorRuntime from 'regenerator-runtime';

const STATE_NOT_STARTED = 0;
const STATE_PREFLIGHT = 1;
const STATE_IN_PROGRESS = 2;
const STATE_DONE = 3;

const UserNotesImportDialog = ({ onClose, onNotesImported }) => {
  
  const [notesToBeImported, setNotesToBeImported] = useState(null);
  const [importingState, setImportingState] = useState(STATE_NOT_STARTED);
  const [notesImportedUnsuccessfully, setNotesImportedUnsuccessfully] = useState([]);
  const [notesImportedSuccessfully, setNotesImportedSuccessfully] = useState([]);
  const [error, setError] = useState(null);

  let notesProcessed = 0;

  if (notesImportedUnsuccessfully) {
    notesProcessed += notesImportedUnsuccessfully.length;
  }

  if (notesImportedSuccessfully) {
    notesProcessed += notesImportedSuccessfully.length;
  }

  const onDrop = useCallback(acceptedFiles => {
    Array.from(acceptedFiles)
      .filter((file) => file.type === "text/csv")
      .forEach(async (file) => {

        // Get the file text
        const text = await file.text();

        // Parse it
        const result = parse(text, { header: true });
        
        // Add the notes to be imported
        setNotesToBeImported(result.data);
      });
  }, []);

  /**
   * Make sure the entry appears to be valid.
   */
  const isValidNote = (notedata) => {
    return true;
  }

  /**
   * Import the note.
   */
  const importNote = (noteData) => {

    // Stop if the data is invalid
    if (!isValidNote(noteData)) {
      notesImportedUnsuccessfully.push(noteData);
      setNotesImportedUnsuccessfully(notesImportedUnsuccessfully);
    }

    // Continue if it is valid
    else{
      const formData = new FormData();
      formData.append("title", noteData.title);
      formData.append("text", noteData.text);

      if (noteData.work) {
        formData.append("work", noteData.work);
      }
      
      if (noteData.division) {
        formData.append("division", noteData.division);
      }
      
      if (noteData.verse) {
        formData.append("verse", noteData.verse);
      }
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken')
        },
        body: formData
      };

      fetch(ENDPOINT_NOTE_EDIT(), requestOptions)
        .then((res) => res.json())
        .then((editedNote) => {
          notesImportedSuccessfully.push(editedNote);
          setNotesImportedSuccessfully(notesImportedSuccessfully);
        })
        .catch((e) => {
          notesImportedUnsuccessfully.push(noteData);
          setNotesImportedUnsuccessfully(notesImportedUnsuccessfully);
        });
      }
  };

  /**
   * Import the notes we received.
   */
  const importNotes = () => {
    notesToBeImported.map((noteData) => importNote(noteData));
    setImportingState(STATE_DONE);
    onNotesImported();
  };

  useEffect(() => {
    if (notesToBeImported) {
      setImportingState(STATE_IN_PROGRESS);
      importNotes();
    }
  }, [notesToBeImported]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Import Notes" />
      <Modal.Content>
        { importingState === STATE_NOT_STARTED && (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Segment placeholder>
                <Header icon>
                  <Icon name='file outline' />
                  {
                    isDragActive ? 'Drop the files here...' : 'Drag and drop a file; or click here to select a file.'
                  }
                </Header>
            </Segment>
          </div>
        )}
        { importingState === STATE_IN_PROGRESS && (
          <>
          { notesToBeImported && (
          <Progress percent={notesToBeImported/notesProcessed} active>
            There are {notesToBeImported.length - notesProcessed} notes left to import
          </Progress>
          )}
          </>
        )}
        { importingState === STATE_DONE && (
          <>
          <Progress percent={100} success>
            {notesImportedSuccessfully.length} notes were successfully imported.
            {notesImportedUnsuccessfully.length} notes were not successfully imported.
          </Progress>
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

UserNotesImportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onNotesImported: PropTypes.func.isRequired,
};

export default UserNotesImportDialog;
