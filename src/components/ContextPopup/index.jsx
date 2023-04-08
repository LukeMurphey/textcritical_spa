import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Menu } from 'semantic-ui-react'
import PopupDialog from '../PopupDialog';
import { CONTEXT_WORD, CONTEXT_VERSE } from '../Reader/ChapterEventHandlers';
import { SEARCH, READ_WORK } from '../URLs'
import { ENDPOINT_WORK_TEXT } from '../Endpoints';

const ContextPopup = ({
  data, onClose, x, y, positionBelow, positionRight, inverted, contextType, contextData, event, history,
}) => {

  const getDivisionReference = (verse = null) => {
    const divisions = [data.chapter.descriptor];

    if(Object.prototype.hasOwnProperty.call(data.chapter, 'parent_division') && data.chapter.parent_division && data.chapter.parent_division.descriptor) {
      divisions.splice(0, 0, data.chapter.parent_division.descriptor);
    }

    // Add in the verse
    if(verse) {
      divisions.push(verse);
    }

    return divisions;
  };

  const copyVerseToClipboard = () => {
    fetch(ENDPOINT_WORK_TEXT(data.work.title_slug, ...getDivisionReference(contextData.verse)))
      .then((res) => res.json())
      .then((newData) => {
        navigator.clipboard.writeText(newData);
        onClose();
    })
  }

  const copyChapterToClipboard = () => {
    fetch(ENDPOINT_WORK_TEXT(data.work.title_slug, ...getDivisionReference()))
      .then((res) => res.json())
      .then((newData) => {
        navigator.clipboard.writeText(newData);
        onClose();
    })
  }

  const copyLinkToClipboard = () => {
    // Get the URL to the verse if for a verse
    if(contextData.verse !== undefined) {
      navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${READ_WORK(data.work.title_slug, null, ...getDivisionReference(contextData.verse))}`);
    }
    else{
      navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${READ_WORK(data.work.title_slug, null, ...getDivisionReference())}`);
    }
    onClose();
  }

  const searchAllWorks = () => {
    history.push(SEARCH(contextData.word));
    onClose();
  }

  const searchThisWork = () => {
    history.push(SEARCH(`work:${data.work.title_slug} ${contextData.word}`));
    onClose();
  }

  return (
    <PopupDialog
      onClose={onClose}
      inverted={inverted}
      x={x}
      y={y}
      positionBelow={positionBelow}
      positionRight={positionRight}
      width={250}
      maxHeight={140}
      frameless
    >
      <div>
        <Menu style={{ width: '100%' }} inverted={inverted} vertical>
          <Menu.Item
            name='chapter_clipboard'
            onClick={copyChapterToClipboard}
          >
            Copy chapter to clipboard
          </Menu.Item>
          { (contextType === CONTEXT_VERSE || contextType === CONTEXT_WORD) && (
            <>
              <Menu.Item
                name='verse_clipboard'
                onClick={copyVerseToClipboard}
              >
                Copy verse
              </Menu.Item>
              
              <Menu.Item
                name='link_clipboard'
                onClick={copyLinkToClipboard}
              >
                Copy link
              </Menu.Item>
            </>
          )}
          {contextType === CONTEXT_WORD && (
            <>

              <Menu.Item
                name='search_this_work'
                onClick={searchThisWork}
              >
                Search in this work
              </Menu.Item>

              <Menu.Item
                name='search_all_works'
                onClick={searchAllWorks}
              >
                Search in all works
              </Menu.Item>
            
            </>
          )}
        </Menu>
      </div>
    </PopupDialog>
  );
};

ContextPopup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  positionBelow: PropTypes.bool,
  positionRight: PropTypes.bool,
  inverted: PropTypes.bool,
  contextType: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  contextData: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  event: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

ContextPopup.defaultProps = {
  positionBelow: true,
  positionRight: true,
  inverted: false,
};

export default withRouter(ContextPopup);
