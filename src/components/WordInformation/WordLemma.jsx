import React from 'react';
import PropTypes from 'prop-types';

const WordLemma = (props) => {
  const {
    lemma, meaning, description, lexiconEntries,
  } = props;

  return (
    <>
      <div>
        {lemma}
        (
        {description}
        ) :
        {meaning}
      </div>
      {lexiconEntries && (
        lexiconEntries.map((lexiconEntry) => (
          <>
            {lexiconEntry.definition}
          </>
        ))
      )}
    </>
  );
};

WordLemma.propTypes = {
  lemma: PropTypes.string.isRequired,
  meaning: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  lexiconEntries: PropTypes.arrayOf(PropTypes.shape),
};

WordLemma.defaultProps = {
  lexiconEntries: null,
};

export default WordLemma;
