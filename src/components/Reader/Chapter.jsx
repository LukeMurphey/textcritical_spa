import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import './Chapter.css';

/**
 * This class renders the content of chapter of a work.
 */
function WorkView({ content, chapter }) {
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
  chapter: PropTypes.shape.isRequired,
  content: PropTypes.string.isRequired,
};

export default WorkView;
