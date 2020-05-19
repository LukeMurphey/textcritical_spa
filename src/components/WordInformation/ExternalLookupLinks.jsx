
import React from 'react';
import PropTypes from 'prop-types';
import { GOOGLE_SEARCH, PERSEUS_WORD_LOOKUP, LOGEION_WORD_LOOKUP } from '../URLs';

function ExternalLookupLinks({ word }) {
  return (
    <div>
      Look up at
      {' '}
      <a target="_blank" rel="noopener noreferrer" href={PERSEUS_WORD_LOOKUP(word)}>
        Perseus
      </a>
      ,
      {' '}
      <a target="_blank" rel="noopener noreferrer" href={LOGEION_WORD_LOOKUP(word)}>
        Logeion
      </a>
      , or
      {' '}
      <a target="_blank" rel="noopener noreferrer" href={GOOGLE_SEARCH(word)}>
        Google
      </a>
    </div>
  );
}

ExternalLookupLinks.propTypes = {
  word: PropTypes.string.isRequired,
};

export default ExternalLookupLinks;
