import React, { Component } from 'react';
import { Placeholder, Accordion, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ENDPOINT_WORD_PARSE } from '../Endpoints';
import { SEARCH } from '../URLs';
import ErrorMessage from '../ErrorMessage';
import WordLemma from './WordLemma';

const MODE_LOADING = 0;
const MODE_ERROR = 1;
const MODE_DONE = 2;

class WordInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wordInfo: null,
      error: null,
      activeIndex: null,
    };
  }

  static getSearchLinks(word, work) {
    if (work) {
      return (
        <>
          Search for
          {' '}
          {word}
          {' '}
          in
          {' '}
          <Link to={SEARCH(`work:${work} ${word}`)}>this work</Link>
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

  componentDidMount() {
    const { word } = this.props;
    this.getWordInfo(word);
  }

  componentDidUpdate(prevProps) {
    const { word } = this.props;
    if (word !== prevProps.word) {
      this.getWordInfo(word);
    }
  }

  /**
   * Get information for the given word.
   *
   * @param {string} word The word to get information on
   */
  getWordInfo(word) {
    this.setState({ loading: true });

    fetch(ENDPOINT_WORD_PARSE(word))
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          wordInfo: data,
          loading: false,
          error: null,
          activeIndex: null,
        });
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
          loading: false,
        });
      });
  }

  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { word, inverted, work } = this.props;
    const {
      wordInfo, loading, error, activeIndex,
    } = this.state;

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
                    onClick={(e, titleProps) => this.handleClick(e, titleProps)}
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
              {this.getSearchLinks(word, work)}
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
}

WordInformation.propTypes = {
  word: PropTypes.string.isRequired,
  work: PropTypes.string,
  inverted: PropTypes.bool,
};

WordInformation.defaultProps = {
  inverted: false,
  work: null,
};

export default WordInformation;
