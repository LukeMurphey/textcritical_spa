import React from 'react';
import PropTypes from 'prop-types'; import {
  Button, Header, Modal, Segment,
} from 'semantic-ui-react';

const UserNoteViewer = ({ note, onClose, onEdit }) => {

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Note" />
      <Modal.Content>
        <Header level={2}>{note && note.fields && note.fields.title}</Header>

        <Segment>{note && note.fields && note.fields.text}</Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={onEdit}>Edit</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNoteViewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  note: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default UserNoteViewer;
