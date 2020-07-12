import React, { Component } from 'react';
import {
  Button, Header, Modal, Table,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AboutDialog extends Component {
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

  static getInfoLinkRow(title, link, linkName, prefix = '') {
    return (
      <Table.Row>
        <Table.Cell>
          <strong>{title}</strong>
        </Table.Cell>
        <Table.Cell>
          {prefix}
          <a target="_blank" rel="noopener noreferrer" href={link}>
            {linkName}
          </a>
        </Table.Cell>
      </Table.Row>
    );
  }

  render() {
    const { onClose } = this.props;
    return (
      <Modal defaultOpen onClose={onClose} closeIcon>
        <Header icon="info" content="About TextCritical.net" />
        <Modal.Content>
          <p>
            TextCritical.net is a website that provides ancient Greek texts and
            useful analysis tools.
          </p>
          <Table basic="very" celled collapsing>
            <Table.Body>
              {AboutDialog.getInfoRow('Version', '4.4')}
              {AboutDialog.getInfoLinkRow(
                'Sources of the works',
                'https://lukemurphey.net/projects/ancient-text-reader/wiki/Content_Sources',
                'LukeMurphey.net',
                'Available at ',
              )}
              {AboutDialog.getInfoLinkRow(
                'Source Code',
                'https://github.com/LukeMurphey/textcritical_net',
                'Github.com',
                'Available at ',
              )}
              {AboutDialog.getInfoLinkRow(
                'Components used',
                'https://lukemurphey.net/projects/ancient-text-reader/wiki/Dependencies',
                'LukeMurphey.net',
                'Available at ',
              )}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

AboutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AboutDialog;
