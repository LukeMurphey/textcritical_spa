import React from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';
import './WordLemma.css';

const WordLemma = (props) => {
  const {
    lexiconEntries, inverted,
  } = props;

  let className = '';

  if (inverted) {
    className = 'inverted';
  }

  return (
    <>
      {lexiconEntries.length === 0 && (
        <Message warning className={className}>
          <Icon name="warning" />
          No definition available from Liddel and Scott.
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
  inverted: PropTypes.bool,
};

WordLemma.defaultProps = {
  lexiconEntries: null,
  inverted: false,
};

export default WordLemma;
