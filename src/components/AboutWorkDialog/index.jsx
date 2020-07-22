import React, { Component } from 'react';
import {
  Button, Header, Modal, Table, Placeholder, Image,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_WORK_INFO, ENDPOINT_WORK_IMAGE } from '../Endpoints';
import ErrorMessage from '../ErrorMessage';

class AboutWorkDialog extends Component {
  static getInfoRow(title, description) {
    return (
      <Table.Row>
        <Table.Cell>
          <strong>{title}</strong>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
      </Table.Row>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
  }

  componentDidMount() {
    const { work } = this.props;
    this.loadInfo(work);
  }

  loadInfo(work) {
    fetch(ENDPOINT_WORK_INFO(work))
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data });
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  render() {
    const { onClose, work } = this.props;
    const { data, error } = this.state;

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
                    {AboutWorkDialog.getInfoRow('Title', data.title)}
                    {AboutWorkDialog.getInfoRow('Language', data.language)}
                    {AboutWorkDialog.getInfoRow('Source', data.source)}
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
  }
}

AboutWorkDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  work: PropTypes.string.isRequired,
};

export default AboutWorkDialog;
