import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Button } from 'semantic-ui-react';

function SearchResults({
  results,
  page,
  lastPage,
  goBack,
  goNext,
  matchCount,
  resultCount,
  inverted,
}) {
  const renderHighlights = (highlights) => {
    let className = '';
    if (inverted) {
      className = 'inverted';
    }

    // eslint-disable-next-line react/no-danger
    return (<div className={className} dangerouslySetInnerHTML={{ __html: highlights }} />);
  };

  return (
    <>
      <Segment.Group>
        {results.map((result) => (
          <Segment inverted={inverted} key={result.url}>
            <div>
              <strong>
                <a href={result.url}>
                  {result.work}
                  {' '}
                  {result.description}
                </a>
              </strong>
            </div>
            {renderHighlights(result.highlights)}
          </Segment>
        ))}
        <Button.Group attached="bottom">
          <Button inverted={inverted} active={page <= 1} onClick={() => goBack()}>
            Back
          </Button>
          <Button inverted={inverted} active={page >= lastPage} onClick={() => goNext()}>
            Next
          </Button>
        </Button.Group>
      </Segment.Group>
      <div>
        {'Page '}
        {page}
        {' of '}
        {lastPage}
        {' ('}
        {matchCount}
        {' word matches in '}
        {resultCount}
        {' verses)'}
      </div>
    </>
  );
}

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape).isRequired,
  matchCount: PropTypes.number.isRequired,
  resultCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  goBack: PropTypes.func.isRequired,
  goNext: PropTypes.func.isRequired,
  inverted: PropTypes.bool,
};

SearchResults.defaultProps = {
  inverted: false,
};

export default SearchResults;
