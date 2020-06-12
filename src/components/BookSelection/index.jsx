import React, { Component } from 'react';
import {
  Table, Placeholder, Image, Input, Label,
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
    this.searchInput = null;
  }

  componentDidMount() {
    this.loadInfo();
  }

  onSearchChange(data) {
    this.setState({
      search: data.value,
    });
  }

  getWorkRow(work, lazyLoad = true, onLargeScreen = true) {
    const { onSelectWork, loadedWork } = this.props;
    const handler = () => { onSelectWork(work.title_slug); };
    const isRelated = this.isRelatedWork(work);
    const isSameAuthor = this.isSameAuthor(work);
    const isLoadedWork = (loadedWork && loadedWork === work.title_slug);

    return (
      <Table.Row key={work.title_slug}>
        { onLargeScreen && (
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
          <div>
            {work.title}
            <div style={{ display: 'inline-block', float: 'right', paddingRight: 4 }}>
              {isRelated && onLargeScreen && (
                <Label as="a" color="red">Related Work</Label>
              )}
              {isSameAuthor && !isLoadedWork && onLargeScreen && (
                <Label as="a" color="blue">Same Author</Label>
              )}
              {isLoadedWork && onLargeScreen && (
                <Label as="a" color="green">This work</Label>
              )}
              {isRelated && !onLargeScreen && (
                <Label as="a" color="red" circular empty />
              )}
              {isSameAuthor && !isLoadedWork && !onLargeScreen && (
                <Label as="a" color="blue" circular empty />
              )}
            </div>
          </div>
          <div style={{ color: '#888' }}>
            {work.language}
            {work.author && ` by ${work.author}`}
            {work.editor && ` (${work.editor})`}
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  /**
   * Determine if the work is a related work.
   *
   * @param {object} work The work to see if it is a related work
   */
  isRelatedWork(work) {
    const { relatedWorks } = this.props;

    const found = relatedWorks.find((relatedWork) => relatedWork.title_slug === work.title_slug);
    if (found) {
      return true;
    }

    return false;
  }

  /**
   * Determine if the work is by the same author
   *
   * @param {object} work The work to see if it is a related work
   */
  isSameAuthor(work) {
    const { authors } = this.props;

    if (!authors || !work.author) {
      return false;
    }

    const found = authors.find((author) => author.name === work.author);

    if (found) {
      return true;
    }

    return false;
  }

  /**
   * Sort the list of works.
   *
   * @param {array} works The works to sort
   */
  sortWorks(works) {
    works.sort((a, b) => {
      if (this.isRelatedWork(a) && !this.isRelatedWork(b)) {
        return -1;
      }
      if (this.isRelatedWork(b) && !this.isRelatedWork(a)) {
        return 1;
      }
      return a.title > b.title;
    });

    return works;
  }

  loadInfo() {
    fetch(ENDPOINT_WORKS_LISTS())
      .then((res) => res.json())
      .then((works) => {
        this.setState({ works: this.sortWorks(works) });
        this.searchInput.focus();
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  render() {
    const { works, error, search } = this.state;
    const searchLowerCase = search.toLowerCase();

    const onChange = (event, data) => { this.onSearchChange(data); };
    const onChangeDebounced = AwesomeDebouncePromise(onChange, 500);

    const onLargeScreen = window.innerWidth > 767;

    // Change the width on small screens
    const width = onLargeScreen ? 500 : 250;

    return (
      <>
        {!error && works && (
          <div>
            <Input
              ref={(input) => {
                this.searchInput = input;
              }}
              onChange={onChangeDebounced}
              style={{ width: "100%" }}
              placeholder="Search..."
            />
          </div>
        )}
        <div style={{ maxHeight: 400, width, overflowY: "auto" }}>
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
                  .filter((work) =>
                    BookSelection.workMatchesSearch(work, searchLowerCase)
                  )
                  .map((work, index) =>
                    this.getWorkRow(work, index > 15, onLargeScreen)
                  )}
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
  relatedWorks: PropTypes.arrayOf(PropTypes.shape),
  authors: PropTypes.arrayOf(PropTypes.string),
  loadedWork: PropTypes.string,
};

BookSelection.defaultProps = {
  relatedWorks: [],
  authors: [],
  loadedWork: null,
};

export default BookSelection;
