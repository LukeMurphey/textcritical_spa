import React, { useState } from 'react';
import {
  Segment, Input, Container, Header, Button, Checkbox, Loader, Dimmer,
} from 'semantic-ui-react';
import ErrorMessage from '../ErrorMessage';
import { ENDPOINT_SEARCH } from '../Endpoints';

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

  /**
   * Do the search
   */
  const doSearch = () => {
    setSearching(true);

    fetch(ENDPOINT_SEARCH(query, 1, ignoreDiacritics, searchRelatedForms))
      .then((res) => res.json())
      .then((data) => {
        setResultSet(data);
        setSearching(false);
      })
      .catch((e) => {
        setError(e.toString());
        setSearching(false);
      });
  };

  return (
    <Segment>
      <Container>
        <Header as="h1">Search</Header>
        <Input
          action={
            (
              <Button
                onClick={() => doSearch()}
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
        <Segment basic>
          <Dimmer active={searching}>
            {searching && (
              <Loader>Loading</Loader>
            )}
          </Dimmer>
          {error && (
            <ErrorMessage
              title="Unable to perform the search"
              description="The search could not be executed."
              message={error}
            />
          )}
          {!error && resultSet && (
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
          </Segment.Group>
          )}
        </Segment>
      </Container>
    </Segment>
  );
}

export default Search;
