import React from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';
import './WordLemma.css';

const WordLemma = (props) => {
  const {
    lexiconEntries,
  } = props;

  return (
    <>
      {lexiconEntries.length === 0 && (
        <Message warning>
          <Icon name="warning" />
          No definition available
        </Message>
      )}
      {lexiconEntries && (
        lexiconEntries.map((lexiconEntry) => (
          <div
            key={lexiconEntry.lemma_lexical_form}
            className="view_lexicon"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: lexiconEntry.definition }}
          />
        ))
      )}
    </>
  );
};

WordLemma.propTypes = {
  lexiconEntries: PropTypes.arrayOf(PropTypes.shape),
};

WordLemma.defaultProps = {
  lexiconEntries: null,
};

export default WordLemma;
