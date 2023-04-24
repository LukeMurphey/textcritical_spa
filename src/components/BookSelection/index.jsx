import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Placeholder, Image, Input, Label,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
// regeneratorRuntime is needed for AwesomeDebouncePromise
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ENDPOINT_WORKS_LISTS, ENDPOINT_WORK_IMAGE } from '../Endpoints/urls';
import LazyImage from '../LazyImage';
import ErrorMessage from '../ErrorMessage';

const ClickStyle = {
  cursor: 'pointer',
};

const workMatchesSearch = (work, search) => {
  return work.title.toLowerCase().includes(search)
  || work.title_slug.toLowerCase().includes(search)
  || work.author.toLowerCase().includes(search)
  || work.editor.toLowerCase().includes(search)
  || work.language.toLowerCase().includes(search);
}

const BookSelection = ({ relatedWorks, onSelectWork, loadedWork, authors }) => {

  const [works, setWorks] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const searchInput = useRef(null);

  const onSearchChange = (data) => {
    setSearch(data.value);
  }

  /**
   * Determine if the work is a related work.
   *
   * @param {object} work The work to see if it is a related work
   */
   const isRelatedWork = (work) => {
    const found = relatedWorks.find((relatedWork) => relatedWork.title_slug === work.title_slug);
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
  const sortWorks = (worksToSort) => {
    worksToSort.sort((a, b) => {
      if (isRelatedWork(a) && !isRelatedWork(b)) {
        return -1;
      }
      if (isRelatedWork(b) && !isRelatedWork(a)) {
        return 1;
      }
      return a.title > b.title;
    });

    return worksToSort;
  }

  /**
   * Load the list of works from the server.
   */
  const loadInfo = () => {
    fetch(ENDPOINT_WORKS_LISTS())
      .then((res) => res.json())
      .then((worksData) => {
        setWorks(sortWorks(worksData));
        searchInput.current.focus();
      })
      .catch((e) => {
        setError(e.toString());
      });
  }

  /**
   * Determine if the work is by the same author
   *
   * @param {object} work The work to see if it is a related work
   */
   const isSameAuthor = (work) => {
    if (!authors || !work.author) {
      return false;
    }

    const found = authors.find((author) => author.name === work.author);

    if (found) {
      return true;
    }

    return false;
  }

  const getWorkRow = (work, lazyLoad = true, onLargeScreen = true) => {
    const handler = () => { onSelectWork(work.title_slug); };
    const isRelated = isRelatedWork(work);
    const thisIsSameAuthor = isSameAuthor(work);
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
              {thisIsSameAuthor && !isLoadedWork && onLargeScreen && (
                <Label as="a" color="blue">Same Author</Label>
              )}
              {isLoadedWork && onLargeScreen && (
                <Label as="a" color="green">This work</Label>
              )}
              {isRelated && !onLargeScreen && (
                <Label as="a" color="red" circular empty />
              )}
              {thisIsSameAuthor && !isLoadedWork && !onLargeScreen && (
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

  const searchLowerCase = search.toLowerCase();

  const onChange = (event, data) => { onSearchChange(data); };
  const onChangeDebounced = AwesomeDebouncePromise(onChange, 500);

  const onLargeScreen = window.innerWidth > 767;

  // Change the width on small screens
  const width = onLargeScreen ? 500 : 250;

  useEffect(() => {
    loadInfo();
  }, []);

  return (
    <>
      {!error && works && (
        <div>
          <Input
            ref={searchInput}
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
                  workMatchesSearch(work, searchLowerCase)
                )
                .map((work, index) =>
                  getWorkRow(work, index > 15, onLargeScreen)
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
