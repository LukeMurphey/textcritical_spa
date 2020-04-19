import React from 'react';
import PropTypes from 'prop-types';
import './Chapter.css';

/**
 * This class renders the content of chapter of a work.
 */
function WorkView({ content }) {
  return (
    <>
      <div
        className="view_read_work"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

WorkView.propTypes = {
  content: PropTypes.string.isRequired,
};

export default WorkView;
