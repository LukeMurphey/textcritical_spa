import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Header, Button, Placeholder, Message } from 'semantic-ui-react';
import ButtonLink from '../ButtonLink';
import './NotesList.scss';

export const STATE_LIST = 0;
export const STATE_EMPTY = 1;
export const STATE_LOADING = 2;

const UserNotesList = ({ notes, onClose, onSelectNote, onCreateNewNote, topContent, isLoading }) => {

  let state = STATE_EMPTY;

  if (isLoading) {
    state = STATE_LOADING;
  }

  else if (notes && notes.length > 0) {
    state = STATE_LIST;
  }

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Notes" />
      <Modal.Content>
        {topContent}
        {state === STATE_EMPTY && (
          <>
            <Message>
              <Message.Header>No Notes Exist</Message.Header>
              You do not have any notes for this passage.
              <div className="create-first-note-button">
                <Button onClick={onCreateNewNote}>Create New Note</Button>
              </div>
            </Message>
          </>
        )}

        {state !== STATE_EMPTY && (
          <Table compact="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
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
                  </Table.Row>
                ))
              )}
            </Table.Body>
            {state !== STATE_LOADING && (
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell>
                  <Button onClick={onCreateNewNote}>Create New Note</Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
            )}
          </Table>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNotesList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectNote: PropTypes.func.isRequired,
  onCreateNewNote: PropTypes.func.isRequired,
  topContent: PropTypes.element,
  isLoading: PropTypes.bool,
};

UserNotesList.defaultProps = {
  topContent: null,
  isLoading: false,
}

export default UserNotesList;
