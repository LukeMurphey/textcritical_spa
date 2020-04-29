import React, { Component } from 'react';
import {
  Table, Placeholder, Image, Input,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_WORKS_LISTS, ENDPOINT_WORK_IMAGE } from '../Endpoints';
import ErrorMessage from '../ErrorMessage';

class BookSelection extends Component {
  static getWorkRow(work) {
    return (
      <Table.Row>
        <Table.Cell>
          <Image src={ENDPOINT_WORK_IMAGE(work.title_slug, 32)} />
        </Table.Cell>
        <Table.Cell>
          <div>{work.title}</div>
          <div style={{ color: '#888' }}>{work.language}</div>
        </Table.Cell>
      </Table.Row>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      works: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadInfo();
  }

  loadInfo() {
    fetch(ENDPOINT_WORKS_LISTS())
      .then((res) => res.json())
      .then((works) => {
        this.setState({ works });
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  render() {
    const { onClose, onSelectWork } = this.props;
    const { works, error } = this.state;

    return (
      <>
        <div>
          <Input style={{ width: 500 }} placeholder="Search..." />
        </div>
        <div style={{ maxHeight: 400, width: 500, overflowY: 'auto' }}>
          {error && (
          <ErrorMessage
            title="Unable to load the list of works"
            description="Unable to get the list of works from the server"
            message={error}
          />
          )}
          {!error && works && (
          <Table basic="very" celled collapsing>
            <Table.Body>
              {works.map((work) => (
                BookSelection.getWorkRow(work)
              ))}
            </Table.Body>
          </Table>
          )}
          {!error && !works && (
          <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
          )}
        </div>
      </>
    );
  }
}

BookSelection.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BookSelection;
