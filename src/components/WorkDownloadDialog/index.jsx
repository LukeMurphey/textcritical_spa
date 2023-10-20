import React, { useState } from 'react';
import {
  Button, Header, Modal, Radio, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toast } from 'react-semantic-toasts';
import { ENDPOINT_WORK_DOWNLOAD } from '../Endpoints/urls';

const MOBI_FORMAT = 'mobi';
const EPUB_FORMAT = 'epub';

const WorkDownloadDialog = ({ onClose, work }) => {
  const [format, setFormat] = useState(EPUB_FORMAT);

  const download = () => {
    onClose();
    document.location = ENDPOINT_WORK_DOWNLOAD(work, format);
    toast(
      {
          title: 'Download initiated',
          description: <p>Download of the book has been started</p>,
          animation: 'fade up',
          icon: 'download',
      },
    );
  }

  const handleChange = (event, data) => {
    setFormat(data.value);
  }

  return (
    <Modal size="tiny" defaultOpen onClose={onClose}>
      <Header content="Download Book" />
      <Modal.Content>
        <div stryle={{ marginBottom: 12 }}>Select which format you would like to download:</div>
        <Form>
          <Form.Field>
            <Radio
              label="ePUB Format (Recommended)"
              name="radioGroup"
              value={EPUB_FORMAT}
              checked={format === EPUB_FORMAT}
              onChange={(e, d) => handleChange(e, d)}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="MOBI Format (Amazon Kindle)"
              name="radioGroup"
              value={MOBI_FORMAT}
              checked={format === MOBI_FORMAT}
              onChange={(e, d) => handleChange(e, d)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
        <Button primary onClick={() => download()}>Download</Button>
      </Modal.Actions>
    </Modal>
  );
};

WorkDownloadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  work: PropTypes.string.isRequired,
};

export default WorkDownloadDialog;
