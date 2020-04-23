import React from 'react';
import PropTypes from 'prop-types';
import '../Reader/Chapter.css';

const WordLemma = (props) => {
  const {
    lexiconEntries,
  } = props;

  return (
    <>
      {lexiconEntries.length === 0 && (
        <>No definition available</>
      )}
      {lexiconEntries && (
        lexiconEntries.map((lexiconEntry) => (
          <div
            key={lexiconEntry.lemma_lexical_form}
            className="view_read_work"
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
