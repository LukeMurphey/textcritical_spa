import React, { Component } from "react";
import { Button, Header, Modal, Table } from "semantic-ui-react";

class AboutDialog extends Component {
  getInfoRow(title, description) {
    return (
      <Table.Row>
        <Table.Cell>
          <strong>{title}</strong>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
      </Table.Row>
    );
  }

  getInfoLinkRow(title, link, link_name, prefix = "") {
    return (
      <Table.Row>
        <Table.Cell>
          <strong>{title}</strong>
        </Table.Cell>
        <Table.Cell>
          {prefix}
          <a target="_blank" href={link}>
            {link_name}
          </a>
        </Table.Cell>
      </Table.Row>
    );
  }

  render() {
    return (
      <Modal defaultOpen={true} onClose={this.props.onClose} closeIcon>
        <Header icon="info" content="About TextCritical.net" />
        <Modal.Content>
          <p>
            TextCritical.net is a website that provides ancient Greek texts and
            useful analysis tools.
          </p>
        <Table basic="very" celled collapsing>
            <Table.Body>
            {this.getInfoRow("Version", "4.0")}
            {this.getInfoLinkRow(
                "Sources of the works",
                "https://lukemurphey.net/projects/ancient-text-reader/wiki/Content_Sources",
                "LukeMurphey.net",
                "Available at "
            )}
            {this.getInfoLinkRow(
                "Source Code",
                "https://github.com/LukeMurphey/textcritical_net",
                "Github.com",
                "Available at "
            )}
            {this.getInfoLinkRow(
                "Components used",
                "https://lukemurphey.net/projects/ancient-text-reader/wiki/Dependencies",
                "LukeMurphey.net",
                "Available at "
            )}
            </Table.Body>
        </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AboutDialog;
