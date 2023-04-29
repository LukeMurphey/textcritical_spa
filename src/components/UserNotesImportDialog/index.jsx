import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal, Header, Button, Segment, Icon, Progress, Message, Table, List } from "semantic-ui-react";
import { readString } from "react-papaparse";
import { useDropzone } from 'react-dropzone';
// regeneratorRuntime is needed to papa-parse to work (even though the variable isn't used
// explicitly here)
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
import { editNote } from "../Endpoints";
import './index.css';

const STATE_NOT_STARTED = 0;
const STATE_IN_PROGRESS = 1;
const STATE_DONE = 2;

const REQUIRED_COLUMNS = ['title', 'text', 'work', 'reference'];

const UserNotesImportDialog = ({ onClose, onNotesImported }) => {

  const [notesToBeImported, setNotesToBeImported] = useState(null);
  const [importingState, setImportingState] = useState(STATE_NOT_STARTED);
  const [error, setError] = useState(null);
  const [lastNoteImported, setLastNoteImported] = useState(0);

  const notesImportedUnsuccessfully = useRef([]);
  const notesImportedSuccessfully = useRef([]);
  const importErrors = useRef({});
  const stopImport = useRef(false);

  let notesProcessed = 0;

  if (notesImportedUnsuccessfully.current) {
    notesProcessed += notesImportedUnsuccessfully.current.length;
  }

  if (notesImportedSuccessfully.current) {
    notesProcessed += notesImportedSuccessfully.current.length;
  }

  const stopAndClose = () => {
    stopImport.current = true;
    onClose();
  }

  /**
   * Validate the file.
   *
   * @param {object} notedata The parsed notes import file
   * @returns 
   */
  const getFileValidationErrors = (notedata) => {
    // Verify that the required columns are present
    if (!notedata) {
      return "File is empty";
    }

    // Stop if there isn't at least one row
    if (notedata.length < 1) {
      return "There are no rows to import";
    }

    const firstrow = notedata[0];

    const missingColumns = REQUIRED_COLUMNS.map((column) => {
      if (!(column in firstrow)) {
        return column;
      }
      
      return null;
    }).filter((data) => data !== null)

    if (missingColumns && missingColumns.length > 0) {
      return `File is missing some required columns: ${missingColumns.join(", ")}`;
    }

    return null;
  }

  const onDrop = useCallback(acceptedFiles => {
    Array.from(acceptedFiles)
      .filter((file) => file.type === "text/csv")
      .forEach(async (file) => {

        // Get the file text
        const text = await file.text();

        // Parse it
        const result = readString(text, { header: true, skipEmptyLines: true });

        // Validate the file
        const fileValidationErrors = getFileValidationErrors(result.data);

        if (fileValidationErrors) {
          setError(fileValidationErrors);
        }
        else {
          // Add the notes to be imported
          setNotesToBeImported(result.data);
        }
      });
  }, []);

  /**
   * Make sure the entry appears to be valid.
   * 
   * This will return null if there are no errors and will return a string describing the problem
   * if there is one.
   */
  const getNoteValidationErrors = (notedata) => {
    // Verify that the required columns are present
    if (!notedata) {
      return "Note is empty";
    }

    // Stop if there isn't at least one row
    if (notedata.length < 1) {
      return "There is no data to import";
    }

    const missingColumns = REQUIRED_COLUMNS.map((column) => {
      if (!(column in notedata)) {
        return column;
      }
      
      if (!notedata[column] || notedata[column].length === 0){
        return column;
      }

      return null;
    }).filter((data) => data !== null)

    if (missingColumns && missingColumns.length > 0) {
      return `Note is missing some data: ${missingColumns.join(", ")}`;
    }

    return null;
  }

  const addImportError = (validationError) => {
      if (validationError in importErrors.current) {
        importErrors.current[validationError] += 1;
      }
      else {
        importErrors.current[validationError] = 1;
      }
  }

  /**
   * Import the note.
   */
  const importNote = (noteData) => {

    // Stop if the data is invalid
    const validationError = getNoteValidationErrors(noteData)
    if (validationError !== null) {
      notesImportedUnsuccessfully.current.push(noteData);

      addImportError(validationError);
    }

    // Continue if it is valid
    else {
      editNote({
        onSuccess: (editedNote) => {
          if ('message' in editedNote) {
            notesImportedUnsuccessfully.current.push(noteData);
            addImportError(editedNote.message);
          }
          else {
            notesImportedSuccessfully.current.push(editedNote);
          }
        },
        onError: (e) => {
          notesImportedUnsuccessfully.current.push(noteData);
          addImportError(e);
        },
        title: noteData.title,
        text: noteData.text,
        work: noteData.work,
        reference: noteData.reference,
        beForgiving: true,
      });
    }
  };

  const importNextNote = (offset) => {
    if (stopImport.current) {
      // Stop the import but not scheduling the next import
    }
    // Stop if we are done
    else if (offset >= notesToBeImported.length) {
      setImportingState(STATE_DONE);
      onNotesImported();
    }

    // Otherwise, import the next note
    else {
      // Import the note
      importNote(notesToBeImported[offset]);
      setLastNoteImported(notesToBeImported[offset].title);

      // Queue up the next one
      setTimeout(() => importNextNote(offset + 1), 100);
    }
  }

  /**
   * Import the notes we received.
   */
  const importNotes = (useTimeout = true) => {
    stopImport.current = false;

    if (useTimeout) {
      importNextNote(0);
    }
    else {
      notesToBeImported.map((noteData) => importNote(noteData));
      setImportingState(STATE_DONE);
      onNotesImported();
    }
  };

  useEffect(() => {
    if (notesToBeImported) {
      setImportingState(STATE_IN_PROGRESS);
      importNotes();
    }
  }, [notesToBeImported]);

  // Get the things we need for the dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Modal defaultOpen onClose={stopAndClose} closeIcon closeOnDimmerClick={false} closeOnDocumentClick={false}>
      <Header icon="info" content="Import Notes" />
      <Modal.Content>
        {error && (
          <Message negative>
            <Message.Header>File could not be imported</Message.Header>
            <p>{error}</p>
          </Message>
        )}
        {importingState === STATE_NOT_STARTED && (
          <>
            You can import notes from a CSV file. The file needs to include four columns:
            <div className="fields-list">
              <List>
                <List.Item>
                  <strong>work:</strong>
                  {"The name of the work (e.g. \"New Testament\" or \"new-testament\")"}
                </List.Item>
                <List.Item>
                  <strong>title:</strong>
                  The title of the note
                </List.Item>
                <List.Item>
                  <strong>text:</strong>
                  The text of the note; can include Markdown
                </List.Item>
                <List.Item>
                  <strong>reference:</strong>
                  {"The chapter and or verse the note is for (e.g. \"John 1:1\")"}
                </List.Item>
              </List>
            </div>
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
          </>
        )}
        {(importingState === STATE_IN_PROGRESS || importingState === STATE_DONE) && (
          <>
            {importingState === STATE_DONE && (
              <Progress percent={100} success>
                {notesImportedSuccessfully.current.length}
                {' '}
                notes were successfully imported.
                {' '}
                {notesImportedUnsuccessfully.current.length}
                {' '}
                notes were not successfully imported.
              </Progress>
            )}
            {importingState === STATE_IN_PROGRESS && (
              <>
                <Progress percent={Math.round(100 * (notesProcessed / notesToBeImported.length))} progress color='blue'>
                  There are
                  { ' ' }
                  {notesToBeImported.length - notesProcessed}
                  { ' ' }
                  notes left to import.
                </Progress>
                <div>
                  Processed &quot;
                  { lastNoteImported }
                  &quot;.
                </div>
              </>
            )}
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Message</Table.HeaderCell>
                  <Table.HeaderCell>Count</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Successfully imported</Table.Cell>
                  <Table.Cell>{notesImportedSuccessfully.current.length}</Table.Cell>
                </Table.Row>
                {Object.entries(importErrors.current).map((importError) => (
                  <Table.Row>
                    <Table.Cell>{importError[0]}</Table.Cell>
                    <Table.Cell>{importError[1]}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={stopAndClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

UserNotesImportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onNotesImported: PropTypes.func.isRequired,
};

export default UserNotesImportDialog;
