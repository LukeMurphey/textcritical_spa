import React, { Component } from 'react';
import { Placeholder, Accordion, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_WORD_PARSE } from '../Endpoints';
import ErrorMessage from '../ErrorMessage';
import WordLemma from './WordLemma';

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
    const { word } = this.props;
    const {
      wordInfo, loading, error, activeIndex,
    } = this.state;

    return (
      <>
        {!loading && wordInfo && (
          <div>
            Found
            { ' ' }
            {wordInfo.length}
            { ' ' }
            {wordInfo.length !== 1 && (
              <>parses for</>
            )}
            {wordInfo.length === 1 && (
              <>parse for</>
            )}
            { ' ' }
            {word}
            .
            {wordInfo && wordInfo.length > 0 && wordInfo[0].ignoring_diacritics && (
              <>
                {' '}
                An exact match could not be found, so similar words with different diacritical marks
                are being returned.
              </>
            )}
            <Accordion style={{ marginTop: 18 }} fluid>
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
                    />
                  </Accordion.Content>
                </React.Fragment>
              ))}
            </Accordion>
            <div style={{ marginTop: 12 }}>
              Look up at
              {' '}
              <a target="_blank" rel="noopener noreferrer" href={`http://www.perseus.tufts.edu/hopper/morph?l=${word}&la=greek`}>
                Perseus
              </a>
              ,
              {' '}
              <a target="_blank" rel="noopener noreferrer" href={`https://logeion.uchicago.edu/${word}`}>
                Logeion
              </a>
              , or
              {' '}
              <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/search?q=${word}`}>
                Google
              </a>
            </div>
          </div>
        )}
        {!loading && error && (
          <div>
            <ErrorMessage
              title="Unable to get word information"
              description="Information for the given word could not be obtained."
              message={error}
            />
          </div>
        )}
        {loading && (
          <Placeholder style={{ marginTop: 32 }}>
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
};

export default WordInformation;
