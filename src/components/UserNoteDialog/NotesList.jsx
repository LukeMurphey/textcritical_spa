import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Header, Button } from 'semantic-ui-react'

export const STATE_LIST = 0;
export const STATE_EMPTY = 1;

const UserNotesList = ({ notes, onClose, onSelectNote }) => {

  let state = STATE_EMPTY;

  if (notes && notes.length > 0) {
    state = STATE_LIST;
  }

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="New Note" />
      <Modal.Content>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {state === STATE_LIST && (
              notes.map((note) => (
                <Table.Row>
                  <Table.Cell>
                    <Button class="" onClick={() => onSelectNote(note)} as='a' href='#'>{note.fields.title}</Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
            {state === STATE_EMPTY && (
              <Table.Row>
                <Table.Cell>No notes exist</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>

        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNotesList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectNote: PropTypes.func.isRequired,
};

export default UserNotesList;
