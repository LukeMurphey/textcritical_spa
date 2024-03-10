import React from 'react';
import PropTypes from "prop-types";
import {Dropdown,
  Header,
} from "semantic-ui-react";
import { convertDivisionsToOptions, workSearch }  from "../shortcuts";
import './index.scss';

const ChapterHeader = ({ inverted, data, onChangeChapter }) => {
  return (
    <Header inverted={inverted} floated="left" as="h3">
      {data.chapter.parent_division && (
      <>
        <Dropdown
          inline
          floating
          deburr
          scrolling
          search={workSearch}
          className="chapterDropdown"
          options={convertDivisionsToOptions(
              data.divisions
            )}
          value={data.chapter.parent_division.descriptor}
          onChange={(event, info) =>
            onChangeChapter(event, info)}
        />
        <div className="chapterText">
          {data.chapter.parent_division.label}
        </div>
        <div
          style={{
              display: "inline-block",
              paddingLeft: 6,
            }}
        >
          {data.chapter.type}
          {` ${data.chapter.descriptor}`}
        </div>
      </>
      )}
    </Header>
  )
};


ChapterHeader.propTypes = {
  data: PropTypes.shape({
      chapter: PropTypes.shape({
        descriptor: PropTypes.string,
        type: PropTypes.string,
        parent_division: PropTypes.shape({
          descriptor: PropTypes.string,
        }),
      }),
      divisions: PropTypes.arrayOf(PropTypes.shape({
        description: PropTypes.string,
        type: PropTypes.string,
        label: PropTypes.string,
      }))
  }),
  onChangeChapter: PropTypes.func,
  inverted: PropTypes.bool,
}

ChapterHeader.defaultProps = {
  data: null,
  onChangeChapter: null,
  inverted: false,
}

export default ChapterHeader;
