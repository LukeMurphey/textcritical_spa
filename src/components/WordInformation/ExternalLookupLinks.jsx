
import React from 'react';
import PropTypes from 'prop-types';

function ExternalLookupLinks({ word }) {
  return (
    <div>
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
  );
}

ExternalLookupLinks.propTypes = {
  word: PropTypes.string.isRequired,
};

export default ExternalLookupLinks;
