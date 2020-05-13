import React, { useState } from 'react';
import {
  Segment, Input, Container, Header, Button, Checkbox, Icon, Message,
} from 'semantic-ui-react';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_SEARCH } from '../Endpoints';

const MODE_NOT_STARTED = 0;
const MODE_SEARCHING = 1;
const MODE_ERROR = 2;
const MODE_NO_RESULTS = 3;
const MODE_RESULTS = 4;

/**
 * This class renders a search page and results.
 */
function Search() {
  const [query, setQuery] = useState('work:abdicatus νομος');
  const [resultSet, setResultSet] = useState(null);
  const [error, setError] = useState(null);
  const [ignoreDiacritics, setIgnoreDiacritics] = useState(false);
  const [searchRelatedForms, setSearchRelatedForms] = useState(false);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  let lastPage = 1;

  if (resultSet) {
    lastPage = Math.round(resultSet.result_count / 10);
  }

  /**
   * Do the search
   */
  const doSearch = (requestedPage) => {
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
          style={{ width: '100%' }}
        />
        <Checkbox label="Search ignoring diacritics" value={ignoreDiacritics} onChange={(e, d) => setIgnoreDiacritics(d.checked)} />
        <Checkbox label="Search related Greek forms (slower but more thorough)" value={searchRelatedForms} onChange={(e, d) => setSearchRelatedForms(d.checked)} />
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
        <Segment.Group>
          {resultSet.results.map((result) => (
            <Segment>
              <div>
                <strong>
                  {result.work}
                  {' '}
                  {result.division}
                  :
                  {result.verse}
                </strong>
              </div>
              {result.highlights}
            </Segment>
          ))}
          <Button.Group attached="bottom">
            <Button active={page <= 1} onClick={() => goBack()}>Back</Button>
            <Button active={page >= lastPage} onClick={() => goNext()}>Next</Button>
          </Button.Group>
        </Segment.Group>
        )}
        {mode === MODE_NOT_STARTED && (
          <Message>
            <Message.Header>Enter a search</Message.Header>
            <p>
              Enter a search term to get started.
            </p>
          </Message>
        )}
      </Container>
    </Segment>
  );
}

export default Search;
