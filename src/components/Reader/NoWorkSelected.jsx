import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'semantic-ui-react';

const NoWorkSelected = ({ inverted, onClick }) => (
  <Message info className={inverted ? 'inverted' : ''}>
    <Message.Header>No Book Selected</Message.Header>
    <p>
      Choose a book above to begin reading.
    </p>
    {onClick && (
      <p>
        <Button onClick={() => onClick()} inverted={inverted}>Open Library</Button>
      </p>
    )}
  </Message>
);

NoWorkSelected.propTypes = {
  onClick: PropTypes.func,
  inverted: PropTypes.bool,
};

NoWorkSelected.defaultProps = {
  inverted: false,
  onClick: null,
};

export default NoWorkSelected;
