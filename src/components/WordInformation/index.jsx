import React, { useState, useEffect } from 'react';
import { Placeholder, Accordion, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ENDPOINT_WORD_PARSE } from '../Endpoints/urls';
import { SEARCH } from '../URLs';
import { PARAMS_SEARCH } from '../URLs/Parameters';
import ErrorMessage from '../ErrorMessage';
import WordLemma from './WordLemma';
import { MODE_LOADING, MODE_ERROR, MODE_DONE } from "../Constants";

const WordInformation = ({ word, inverted, work, searchState }) => {
  const [loading, setLoading] = useState(false);
  const [wordInfo, setWordInfo] = useState(null);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const getSearchLinks = (state = null) => {
    if (work) {
      return (
        <>
          Search for
          {' '}
          {word}
          {' '}
          in
          {' '}
          <Link to={{
            pathname: SEARCH(),
            search: PARAMS_SEARCH(`work:${work} ${word}`),
            state,
            }}
          >
            this work
          </Link>
          {' '}
          or
          {' '}
          <Link to={SEARCH(word)}>all works</Link>
        </>
      );
    }
    return (
      <>
        Search for
        {' '}
        <Link to={SEARCH(word)}>{word}</Link>
      </>
    );
  }


  /**
   * Get information for the given word.
   *
   * @param {string} wordToLookup The word to get information on
   */
   const getWordInfo = () => {
    setLoading(true);

    fetch(ENDPOINT_WORD_PARSE(word))
      .then((res) => res.json())
      .then((data) => {
        setWordInfo(data);
        setLoading(false);
        setError(null);
        setActiveIndex(null);
      })
      .catch((e) => {
        setError(e.toString());
        setLoading(false);
      });
  }

  useEffect(() => {
    getWordInfo();
  }, [word]);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  }

  let mode = MODE_LOADING;
  if (!loading && wordInfo) {
    mode = MODE_DONE;
  }
  else if (!loading && error) {
    mode = MODE_ERROR;
  }

  return (
    <>
      {mode === MODE_DONE && (
        <div>
          Found
          {' '}
          {wordInfo.length}
          {' '}
          {wordInfo.length !== 1 && (
            <>parses for</>
          )}
          {wordInfo.length === 1 && (
            <>parse for</>
          )}
          {' '}
          {word}
          .
          {wordInfo && wordInfo.length > 0 && wordInfo[0].ignoring_diacritics && (
            <>
              {' '}
              An exact match could not be found, so similar words with different diacritical marks
              are being returned.
            </>
          )}
          <Accordion inverted={inverted} style={{ marginTop: 18 }} fluid>
            {wordInfo.map((entry, index) => (
              <React.Fragment key={`${entry.form}::${entry.description}`}>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={(e, titleProps) => handleClick(e, titleProps)}
                >
                  <Icon name="dropdown" />
                  {entry.lemma}
                  {' '}
                  (
                  {entry.description}
                  ):
                  {' '}
                  {entry.meaning}
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndex === index}
                >
                  <WordLemma
                    lexiconEntries={entry.lexicon_entries}
                    inverted={inverted}
                  />
                </Accordion.Content>
              </React.Fragment>
            ))}
          </Accordion>
          <div style={{ marginTop: 12 }}>
            {getSearchLinks(word, work, searchState)}
          </div>
        </div>
      )}
      {mode === MODE_ERROR && (
        <div>
          <ErrorMessage
            inverted={inverted}
            title="Unable to get word information"
            description="Information for the given word could not be obtained."
            message={error}
          />
        </div>
      )}
      {mode === MODE_LOADING && (
        <Placeholder inverted={inverted} style={{ marginTop: 32 }}>
          <Placeholder.Header>
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      )}
    </>
  );
}

WordInformation.propTypes = {
  word: PropTypes.string.isRequired,
  work: PropTypes.string,
  inverted: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  searchState: PropTypes.object,
};

WordInformation.defaultProps = {
  inverted: false,
  work: null,
  searchState: null,
};

export default WordInformation;
