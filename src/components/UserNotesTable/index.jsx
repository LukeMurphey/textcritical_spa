import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Placeholder, Button, Message } from 'semantic-ui-react';
import moment from "moment";
import { ENDPOINT_NOTES } from "../Endpoints";
import ButtonLink from "../ButtonLink";

export const STATE_LOADING = 0;
export const STATE_ERROR = 1;
export const STATE_LIST = 2;
export const STATE_NO_NOTES = 3;

const UserNotesTable = ({ inverted }) => {

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getNotes = () => {
    setIsLoading(true);
    fetch(ENDPOINT_NOTES())
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

  // Load the note when opening the form
  useEffect(() => {
    getNotes()
  }, []);

  const onCreateNewNote = () => {

  };

  const onSelectNote = () => {

  }

  let state = STATE_NO_NOTES;

  if (isLoading) {
    state = STATE_LOADING;
  }

  else if (notes && notes.length > 0) {
    state = STATE_LIST;
  }

  return (
    <>
      {state === STATE_NO_NOTES && (
        <Message>
          <Message.Header>No Notes Exist</Message.Header>
          You do not have any notes for this passage.
          <div className="create-first-note-button">
            <Button onClick={onCreateNewNote}>Create New Note</Button>
          </div>
        </Message>
      )}
      {state !== STATE_NO_NOTES && (
        <Table inverted={inverted} compact="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {state === STATE_LOADING && (
              <Table.Row>
                <Table.Cell>
                  <Placeholder>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Table.Cell>
              </Table.Row>
            )}
            {state === STATE_LIST && (
              notes.map((note) => (
                <Table.Row>
                  <Table.Cell>
                    <ButtonLink onClick={() => onSelectNote(note)}>{note.fields.title}</ButtonLink>
                  </Table.Cell>
                  <Table.Cell>
                    {moment(note.fields.date_created).format("MMMM Do YYYY, h:mm:ss a")}
                    {' '}
                    (
                    {moment(note.fields.date_created).fromNow()}
                    )
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
          {state !== STATE_LOADING && (
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>
                  <Button onClick={onCreateNewNote}>Create New Note</Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      )}
    </>
  );
};

UserNotesTable.propTypes = {
  inverted: PropTypes.bool,
};

UserNotesTable.defaultProps = {
  inverted: false,
};

export default UserNotesTable;
