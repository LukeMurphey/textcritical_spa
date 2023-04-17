import React from 'react';
import PropTypes from 'prop-types';
import { Table, Placeholder, Button, Message, Icon } from 'semantic-ui-react';
import moment from "moment";
import ButtonLink from "../ButtonLink";
import { READ_WORK } from '../URLs';

export const STATE_LOADING = 0;
export const STATE_ERROR = 1;
export const STATE_LIST = 2;
export const STATE_NO_NOTES = 3;

const UserNotesTable = ({ inverted, isLoading, notes, onCreateNewNote, onSelectNote, showWorkLinks }) => {

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
              { showWorkLinks && (
                <Table.HeaderCell>Work</Table.HeaderCell>
              )}
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
                  { showWorkLinks && (
                    <>
                      <Table.Cell>
                        <a href={READ_WORK(note.fields.work_title_slug, null, note.fields.division_full_descriptor)}>View Reference</a>
                      </Table.Cell>
                    </>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
          {state !== STATE_LOADING && (
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan={showWorkLinks ? '3' : '2'}>
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
  // eslint-disable-next-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  onCreateNewNote: PropTypes.func.isRequired,
  onSelectNote: PropTypes.func.isRequired,
  showWorkLinks: PropTypes.bool,
};

UserNotesTable.defaultProps = {
  inverted: false,
  isLoading: false,
  notes: null,
  showWorkLinks: true,
};

export default UserNotesTable;
