import React from "react";
import PropTypes from "prop-types";
import { Modal, Header, Button } from "semantic-ui-react";

const UserNotesImportDialog = ({ onClose }) => (
  <Modal defaultOpen onClose={onClose} closeIcon>
    <Header icon="info" content="Import Notes" />
    <Modal.Content>
      Drag a file in to start an import.
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose}>Close</Button>
    </Modal.Actions>
  </Modal>
);

UserNotesImportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UserNotesImportDialog;
