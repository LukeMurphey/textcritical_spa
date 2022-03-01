import React, { useState, useEffect } from 'react';
import {
  Button, Header, Modal, Table, Placeholder, Image,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_WORK_INFO, ENDPOINT_WORK_IMAGE } from '../Endpoints';
import ErrorMessage from '../ErrorMessage';


const AboutWorkDialog = ({ onClose, work }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const loadInfo = () => {
    fetch(ENDPOINT_WORK_INFO(work))
      .then((res) => res.json())
      .then((newData) => {
        setData(newData);
      })
      .catch((e) => {
        setError(e.toString())
      });
  }

  const getInfoRow = (title, description) => {
    return (
      <Table.Row>
        <Table.Cell>
          <strong>{title}</strong>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
      </Table.Row>
    );
  }

  useEffect(() => {
    loadInfo(work);
  }, []);

  return (
    <Modal size="small" defaultOpen onClose={onClose} closeIcon>
      {!data && (
        <Header icon="info" content="About this Book" />
      )}
      {data && (
        <Header icon="info" content={`About ${data.title}`} />
      )}
      <Modal.Content scrolling>
        {error && (
          <ErrorMessage
            title="Unable to load work information"
            description="Unable to get information about the work from the server"
            message={error}
          />
        )}
        {!error && data && (
          <>
            <div style={{ display: 'inline-block', marginRight: 16 }}>
              <Image style={{width: 100}} src={ENDPOINT_WORK_IMAGE(work, 400)} />
            </div>
            <div style={{ display: 'inline-block' }}>
              <Table basic="very" celled collapsing>
                <Table.Body>
                  {getInfoRow('Title', data.title)}
                  {getInfoRow('Language', data.language)}
                  {getInfoRow('Source', data.source)}
                </Table.Body>
              </Table>
            </div>
            <div style={{ marginTop: 16 }}>
              {data.source_description && (
                data.source_description
              )}
            </div>
            {data.wiki_info && (
              <div style={{ marginTop: 16 }}>
                {data.wiki_info.summary}
              </div>
            )}
          </>
        )}
        {!error && !data && (
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        )}
      </Modal.Content>
      <Modal.Actions>
        {data && data.wiki_info && (
          <a target="_blank" style={{ marginTop: 10, float: 'left' }} rel="noopener noreferrer" href={data.wiki_info.url}>View on wikipedia</a>
        )}
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

AboutWorkDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  work: PropTypes.string.isRequired,
};

export default AboutWorkDialog;
