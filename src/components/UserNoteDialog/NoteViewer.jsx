import React from 'react';
import PropTypes from 'prop-types'; import {
  Button, Header, Modal,
} from 'semantic-ui-react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import NewTabLinkRewriter from './NewTabLinkRewriter';

const UserNoteViewer = ({ note, onClose, onEdit, onCancel, onDelete }) => {

  return (
    <Modal defaultOpen onClose={onClose}>
      <Header content="Note" />
      <Modal.Content>
        <Header level={2}>{note && note.title}</Header>

        <div data-color-mode="light">
          <MDEditor.Markdown
            source={note && note.text}
            style={{ whiteSpace: 'pre-wrap' }}
            rehypeRewrite={NewTabLinkRewriter}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        { onDelete && (
          <Button style={{float: 'left'}} negative onClick={() => onDelete(note)}>Delete</Button>
        )}
        { onEdit && (
          <Button primary onClick={onEdit}>Edit</Button>
        )}
        { onCancel && (
          <Button onClick={onCancel}>Back</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )

};

UserNoteViewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  note: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
};

UserNoteViewer.defaultProps = {
  onCancel: null,
  onEdit: null,
  onDelete: null,
}

export default UserNoteViewer;
