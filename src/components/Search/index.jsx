import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useLocation } from 'react-router-dom';
import {
  Segment, Input, Container, Header, Button, Checkbox, Icon, Message, Tab,
} from 'semantic-ui-react';
import BarChart from '../Charts/BarChart';
import SearchResults from './SearchResults';
import SearchHelp from './SearchHelp';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_SEARCH } from '../Endpoints';
import { SEARCH } from '../URLs';
import './index.scss';

const MODE_NOT_STARTED = 0;
const MODE_SEARCHING = 1;
const MODE_ERROR = 2;
const MODE_NO_RESULTS = 3;
const MODE_RESULTS = 4;

const CONVERT_INT = 0;
const CONVERT_BOOL = 1;

const CheckboxStyle = {
  marginTop: 12,
  marginRight: 12,
  marginBottom: 12,
};

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function searchResultsByMode(mode, resultSet, page, lastPage, goBack, goNext, error, inverted) {
  let className = '';

  if (inverted) {
    className = 'inverted';
  }

  return (
    <Tab.Pane inverted={inverted}>
      {mode === MODE_SEARCHING && (
        <Message icon className={className}>
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
          inverted={inverted}
        />
      )}
      {mode === MODE_NO_RESULTS && (
        <Message className={className}>
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
          inverted={inverted}
        />
      )}
      {mode === MODE_NOT_STARTED && (
        <Message className={className}>
          <Message.Header>Enter a search</Message.Header>
          <p>
            Enter a search term to get started.
          </p>
        </Message>
      )}
    </Tab.Pane>
  );
}

/**
 * Gets the parameter of the default value. This optionally converts the parameter format too.
 * @param {string} searchParams The string containing the URL parameters
 * @param {*} paramName The name of the paramter to get
 * @param {*} defaultValue The default value if the paramter doesn't exist yet
 * @param {*} convertFormat Whether to convert the value type (null or CONVERT_INT or CONVERT_BOOL)
 */
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
function Search({ inverted, history, location }) {
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
  const [searchedKey, setSearchedKey] = useState(null);

  let className = '';

  if (inverted) {
    className = 'inverted';
  }

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
    history.push(SEARCH(q, diacritics, relatedForms, selectedPage));
  };

  /**
   * Update the history so that the search is kicked off.
   *
   * @param {int} requestedPage The page number
   */
  const doSearch = (requestedPage) => {
    updateHistory(query, requestedPage, ignoreDiacritics, searchRelatedForms);
  };

  /**
   * Perform the REST call to perform the search
   *
   * @param {int} requestedPage The page number
   */
  const executeSearch = (requestedPage) => {
    setSearching(true);
    setError(null);
    setPage(requestedPage);

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

  useEffect(() => {
    // Use the searched key to determine if we have already searched for this page
    if (location.key !== searchedKey) {
      setSearchedKey(location.key);
      executeSearch(getParamOrDefault(queryParams, 'page', page, CONVERT_INT));
    }
  });

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

  // Create the list of tab panes to show
  const panes = [
    {
      menuItem: 'Results',
      render: () => searchResultsByMode(
        mode, resultSet, page, lastPage, goBack, goNext, error, inverted,
      ),
    },
    {
      menuItem: 'Matched words',
      render: () => (
        <Tab.Pane inverted={inverted}>
          {resultSet && (
            <BarChart
              results={resultSet.matched_terms}
              title="Frequency of matched words"
              noDataMessage="No data available on matched terms"
              inverted={inverted}
            />
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Matched works',
      render: () => (
        <Tab.Pane inverted={inverted}>
          {resultSet && (
            <BarChart
              results={resultSet.matched_works}
              title="Frequency of matched works"
              noDataMessage="No data available on matched works"
              inverted={inverted}
            />
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Matched sections',
      render: () => (
        <Tab.Pane inverted={inverted}>
          {resultSet && (
            <BarChart
              results={resultSet.matched_sections}
              title="Frequency of matched sections"
              noDataMessage="No data available on matched sections"
              inverted={inverted}
            />
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Help',
      render: () => <Tab.Pane inverted={inverted}><SearchHelp inverted={inverted} /></Tab.Pane>,
    },
  ];

  return (
    <Segment inverted={inverted}>
      <Container>
        <Header inverted={inverted} as="h1">Search</Header>
        <Input
          action={
            (
              <Button
                onClick={() => doSearch(1)}
                basic
                inverted={inverted}
              >
                Go
              </Button>
            )
          }
          inverted={inverted}
          placeholder="Enter the text to search for (e.g. νόμου or no/mou)"
          value={query}
          onChange={(e, d) => setQuery(d.value)}
          onKeyPress={(e) => onKeyPressed(e)}
          style={{ width: '100%' }}
        />
        <Checkbox className={className} style={CheckboxStyle} label="Search ignoring diacritics" checked={ignoreDiacritics} onChange={(e, d) => setIgnoreDiacritics(d.checked)} />
        <Checkbox className={className} style={CheckboxStyle} label="Search related Greek forms (slower but more thorough)" checked={searchRelatedForms} onChange={(e, d) => setSearchRelatedForms(d.checked)} />
        <Tab className={className} panes={panes} />
      </Container>
    </Segment>
  );
}

Search.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
};

Search.defaultProps = {
  inverted: false,
};

export default withRouter(Search);
