import React from 'react';
import PropTypes from 'prop-types'; import {
  Button, Header, Modal,
} from 'semantic-ui-react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import NewTabLinkRewriter from 'src/components/NewTabLinkRewriter';
import './NoteView.scss';

const NoteView = ({ note, onClose, onEdit, onCancel, onDelete, inverted }) => {

  return (
      <div class="noteView">
        <Header inverted={inverted} level={2}>{note && note.title}</Header>

        <div data-color-mode="dark">
          <MDEditor.Markdown
            source={note && note.text}
            style={{ whiteSpace: 'pre-wrap' }}
            rehypeRewrite={NewTabLinkRewriter}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      <div class="noteViewControls">
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
      </div>
    </div>
  )
};

NoteView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  note: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  inverted: PropTypes.bool,
};

NoteView.defaultProps = {
  onCancel: null,
  onEdit: null,
  onDelete: null,
  inverted: true,
}

export default NoteView;
