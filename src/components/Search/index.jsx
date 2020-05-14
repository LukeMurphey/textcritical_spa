import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useLocation } from 'react-router-dom';
import {
  Segment, Input, Container, Header, Button, Checkbox, Icon, Message, Tab,
} from 'semantic-ui-react';
import SearchResults from './SearchResults';
import SearchHelp from './SearchHelp';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_SEARCH } from '../Endpoints';
import './index.scss';

const MODE_NOT_STARTED = 0;
const MODE_SEARCHING = 1;
const MODE_ERROR = 2;
const MODE_NO_RESULTS = 3;
const MODE_RESULTS = 4;

const CONVERT_INT = 0;
const CONVERT_BOOL = 1;

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function searchResultsByMode(mode, resultSet, page, lastPage, goBack, goNext, error) {
  return (
    <Tab.Pane>
      {mode === MODE_SEARCHING && (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            Performing the search...
          </Message.Content>
        </Message>
      )}
      {mode === MODE_ERROR && (
        <ErrorMessage
          title="Unable to perform the search"
          description="The search could not be executed."
          message={error}
        />
      )}
      {mode === MODE_NO_RESULTS && (
        <Message>
          <Message.Header>No Results Found</Message.Header>
          <p>
            No Results were found for the given search.
          </p>
        </Message>
      )}
      {mode === MODE_RESULTS && (
        <SearchResults
          results={resultSet.results}
          matchCount={resultSet.match_count}
          resultCount={resultSet.result_count}
          page={page}
          lastPage={lastPage}
          goBack={() => goBack()}
          goNext={() => goNext()}
        />
      )}
      {mode === MODE_NOT_STARTED && (
        <Message>
          <Message.Header>Enter a search</Message.Header>
          <p>
            Enter a search term to get started.
          </p>
        </Message>
      )}
    </Tab.Pane>
  );
}

function getParamOrDefault(searchParams, paramName, defaultValue, convertFormat = null) {
  const paramValue = searchParams.get(paramName);
  if (paramValue) {
    if (convertFormat === CONVERT_INT) {
      return parseInt(paramValue, 10);
    }

    if (convertFormat === CONVERT_BOOL && paramValue === '0') {
      return false;
    }

    if (convertFormat === CONVERT_BOOL) {
      return true;
    }

    return paramValue;
  }

  return defaultValue;
}

/**
 * This class renders a search page and results.
 */
function Search({ history }) {
  // Get the query params
  const queryParams = useQuery();

  // Setup state
  const [query, setQuery] = useState(getParamOrDefault(queryParams, 'q', ''));
  const [resultSet, setResultSet] = useState(null);
  const [error, setError] = useState(null);
  const [ignoreDiacritics, setIgnoreDiacritics] = useState(getParamOrDefault(queryParams, 'ignore_diacritics', false, CONVERT_BOOL));
  const [searchRelatedForms, setSearchRelatedForms] = useState(getParamOrDefault(queryParams, 'include_related', false, CONVERT_BOOL));
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(getParamOrDefault(queryParams, 'page', 1, CONVERT_INT));

  // Calculate the last page
  let lastPage = 1;

  if (resultSet) {
    lastPage = Math.ceil(resultSet.result_count / 10);
  }

  /**
   * Change the history entry.
   *
   * @param {string} q The search query
   * @param {integer} selectedPage The page offset
   * @param {bool} diacritics Whether diacritics ought to be ignored
   * @param {bool} relatedForms Whether related forms ought to be ignored
   */
  const updateHistory = (q, selectedPage, diacritics, relatedForms) => {
    let url = `/search?q=${q}`;

    if (page) {
      url += `&page=${page}`;
    }

    if (diacritics) {
      url += '&ignore_diacritics=1';
    }

    if (relatedForms) {
      url += '&include_related=1';
    }

    history.push(url);
  };

  /**
   * Do the search
   */
  const doSearch = (requestedPage) => {
    setSearching(true);
    setError(null);
    setPage(requestedPage);

    updateHistory(query, requestedPage, ignoreDiacritics, searchRelatedForms);

    fetch(ENDPOINT_SEARCH(query, requestedPage, ignoreDiacritics, searchRelatedForms))
      .then((res) => res.json())
      .then((data) => {
        setResultSet(data);
        setSearching(false);
        setError(null);
      })
      .catch((e) => {
        setError(e.toString());
        setSearching(false);
        setResultSet(null);
      });
  };

  const goBack = () => {
    if (page > 1) {
      doSearch(page - 1);
    }
  };

  const goNext = () => {
    if (page < lastPage) {
      doSearch(page + 1);
    }
  };

  const onKeyPressed = (event) => {
    if (event.key === 'Enter') {
      doSearch(1);
    }
  };

  // Figure out what mode the page is in
  let mode = MODE_NOT_STARTED;

  if (searching) {
    mode = MODE_SEARCHING;
  } else if (error) {
    mode = MODE_ERROR;
  } else if (resultSet && resultSet.result_count === 0) {
    mode = MODE_NO_RESULTS;
  } else if (resultSet && resultSet.result_count > 0) {
    mode = MODE_RESULTS;
  }

  const panes = [
    {
      menuItem: 'Results',
      render: () => searchResultsByMode(mode, resultSet, page, lastPage, goBack, goNext, error),
    },
    {
      menuItem: 'Help',
      render: () => <Tab.Pane><SearchHelp /></Tab.Pane>,
    },
  ];

  return (
    <Segment>
      <Container>
        <Header as="h1">Search</Header>
        <Input
          action={
            (
              <Button
                onClick={() => doSearch(1)}
                basic
              >
                Go
              </Button>
            )
          }
          placeholder="Enter the text to search for (e.g. νόμου or no/mou)"
          value={query}
          onChange={(e, d) => setQuery(d.value)}
          onKeyPress={(e) => onKeyPressed(e)}
          style={{ width: '100%' }}
        />
        <Checkbox label="Search ignoring diacritics" checked={ignoreDiacritics} onChange={(e, d) => setIgnoreDiacritics(d.checked)} />
        <Checkbox label="Search related Greek forms (slower but more thorough)" checked={searchRelatedForms} onChange={(e, d) => setSearchRelatedForms(d.checked)} />
        <Tab panes={panes} />
      </Container>
    </Segment>
  );
}

Search.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

Search.defaultProps = {
  match: null,
  location: null,
  history: null,
};

export default withRouter(Search);
