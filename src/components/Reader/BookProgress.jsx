import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Progress } from 'semantic-ui-react';

const BookProgress = ({ data, inverted }) => {

    // Create a custom className for signaling the desire to switch to inverted
    let classNameSuffix = "";

    if (inverted) {
      classNameSuffix = " inverted";
    }

    return (
      <>
        { data && data.total_chapters > 1 && data.total_chapters_in_book > 1 && (
          <>
            <Segment.Group
              horizontal
              style={{ border: 0, marginBottom: 4 }}
              className={`${classNameSuffix}`}
            >
              <Segment basic inverted style={{ padding: 0 }}>
                {data.completed_chapters_in_book}
                {' '}
                of
                {" "}
                {data.total_chapters_in_book}
                {' '}
                chapters
                {" "}
              </Segment>
              <Segment
                basic
                inverted
                style={{ textAlign: "right", padding: 0 }}
              >
                {Math.round(data.progress_in_book)}
                % through the book
              </Segment>
            </Segment.Group>
            <Progress
              className="bookProgress"
              color="blue"
              style={{ margin: "0 0 8px 0" }}
              percent={data.progress_in_book}
              size="tiny"
            />
          </>
        )}
      </>
)};

BookProgress.propTypes = {
  data: PropTypes.shape({
    progress_in_book: PropTypes.number,
    total_chapters_in_book: PropTypes.number,
    completed_chapters_in_book: PropTypes.number,
    total_chapters: PropTypes.number,
}),
  inverted: PropTypes.bool,
};

BookProgress.defaultProps = {
  inverted: false,
  data: null,
};

export default BookProgress;
