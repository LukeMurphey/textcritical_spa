import React from 'react';
import PropTypes from 'prop-types'; import {
  Button, Header, Modal,
} from 'semantic-ui-react';
import MDEditor from '@uiw/react-md-editor';

const UserNoteViewer = ({ note, onClose, onEdit, onCancel }) => {

  return (
    <Modal defaultOpen onClose={onClose} closeIcon>
      <Header icon="info" content="Note" />
      <Modal.Content>
        <Header level={2}>{note && note.fields && note.fields.title}</Header>

        <div data-color-mode="light">
          <MDEditor.Markdown source={note && note.fields && note.fields.text} style={{ whiteSpace: 'pre-wrap' }} />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={onEdit}>Edit</Button>
        <Button onClick={onCancel}>Back</Button>
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
  onCancel: PropTypes.func.isRequired,
};

export default UserNoteViewer;
