import React, { Component } from 'react';
import {
  Table, Placeholder, Image, Input,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
// regeneratorRuntime is needed for AwesomeDebouncePromise
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ENDPOINT_WORKS_LISTS, ENDPOINT_WORK_IMAGE } from '../Endpoints';
import LazyImage from '../LazyImage';
import ErrorMessage from '../ErrorMessage';

const ClickStyle = {
  cursor: 'pointer',
};

class BookSelection extends Component {
  static workMatchesSearch(work, search) {
    return work.title.toLowerCase().includes(search)
    || work.title_slug.toLowerCase().includes(search)
    || work.author.toLowerCase().includes(search)
    || work.editor.toLowerCase().includes(search)
    || work.language.toLowerCase().includes(search);
  }

  constructor(props) {
    super(props);
    this.state = {
      works: null,
      error: null,
      search: '',
    };
  }

  componentDidMount() {
    this.loadInfo();
  }

  onSearchChange(data) {
    this.setState({
      search: data.value,
    });
  }

  getWorkRow(work, lazyLoad = true, displayWorkImages = true) {
    const { onSelectWork } = this.props;
    const handler = () => { onSelectWork(work.title_slug); };

    return (
      <Table.Row key={work.title_slug}>
        { displayWorkImages && (
          <Table.Cell className="workImage" style={ClickStyle} onClick={handler}>
            { lazyLoad && (
              <LazyImage style={{ width: 32 }} src={ENDPOINT_WORK_IMAGE(work.title_slug, 64)}>
                <Image style={{ width: 32 }} src="/book-cover-small.png" />
              </LazyImage>
            )}
            { !lazyLoad && (
              <Image style={{ width: 32 }} src={ENDPOINT_WORK_IMAGE(work.title_slug, 64)} />
            )}
          </Table.Cell>
        )}
        <Table.Cell style={ClickStyle} onClick={handler}>
          <div>{work.title}</div>
          <div style={{ color: '#888' }}>
            {work.language}
            {work.author && ` by ${work.author}`}
            {work.editor && ` (${work.editor})`}
          </div>
        </Table.Cell>
      </Table.Row>
    );
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
    const { displayWorkImages } = this.props;
    const { works, error, search } = this.state;
    const searchLowerCase = search.toLowerCase();

    const onChange = (event, data) => { this.onSearchChange(data); };
    const onChangeDebounced = AwesomeDebouncePromise(onChange, 500);

    let displayWorkImagesEx = displayWorkImages;

    if (displayWorkImages === null) {
      displayWorkImagesEx = window.innerWidth > 767;
    }

    return (
      <>
        {!error && works && (
        <div>
          <Input onChange={onChangeDebounced} style={{ width: '100%' }} placeholder="Search..." />
        </div>
        )}
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
              {works
                .filter((work) => BookSelection.workMatchesSearch(work, searchLowerCase))
                .map((work, index) => (
                  this.getWorkRow(work, index > 15, displayWorkImagesEx)
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
  onSelectWork: PropTypes.func.isRequired,
  displayWorkImages: PropTypes.bool,
};

BookSelection.defaultProps = {
  displayWorkImages: null,
};

export default BookSelection;
