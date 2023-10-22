import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Menu } from 'semantic-ui-react'
import { toast } from 'react-semantic-toasts';
import PopupDialog from '../PopupDialog';
import UserNoteDialog from "../UserNoteDialog";
import { CONTEXT_WORD, CONTEXT_VERSE } from '../Reader/ChapterEventHandlers';
import { SEARCH, READ_WORK } from '../URLs'
import { ENDPOINT_WORK_TEXT, ENDPOINT_CHAPTER_DOWNLOAD } from '../Endpoints/urls';
import { GlobalAppContext } from "../GlobalAppContext";

const ContextPopup = ({
  data, onClose, x, y, positionBelow, positionRight, inverted, contextType, contextData, history,
}) => {

  const { features, authentication } = React.useContext(GlobalAppContext);

  const [userNoteDialogOpen, setUserNoteDialogOpen] = useState(false);

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

        toast(
          {
              title: 'Copied!',
              description: <p>Verse copied to the clipboard</p>,
              animation: 'fade up',
              icon: 'clipboard',
          },
        );
    })
  }

  const downloadChapter = () => {
    fetch(ENDPOINT_CHAPTER_DOWNLOAD(data.work.title_slug, ...getDivisionReference()))
      // .then((res) => res.json())
      .then(() => {
        onClose();
        toast(
          {
              title: 'Download started!',
              description: <p>Chapter being downloaded</p>,
              animation: 'fade up',
              icon: 'download',
          },
        );
    })
  }

  const copyChapterToClipboard = () => {
    fetch(ENDPOINT_WORK_TEXT(data.work.title_slug, ...getDivisionReference()))
      .then((res) => res.json())
      .then((newData) => {
        navigator.clipboard.writeText(newData);
        onClose();
        toast(
          {
              title: 'Copied!',
              description: <p>Chapter copied to the clipboard</p>,
              animation: 'fade up',
              icon: 'clipboard',
          },
        );
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

    toast(
      {
          title: 'Copied!',
          description: <p>Link copied to the clipboard</p>,
          animation: 'fade up',
          icon: 'clipboard',
      },
    );
  }

  const createUserNote = () => {
    setUserNoteDialogOpen(true);
  }

  const searchAllWorks = () => {
    history.push(SEARCH(contextData.word));
    onClose();
  }

  const searchThisWork = () => {
    history.push(SEARCH(`work:${data.work.title_slug} ${contextData.word}`));
    onClose();
  }

  const getMenuItems = () => {
    const menuItems = [];
  
    // Add the copy to chapter option
    menuItems.push(
      <Menu.Item
        name='chapter_clipboard'
        onClick={copyChapterToClipboard}
        key='chapter_clipboard'
      >
        Copy chapter
      </Menu.Item>
    );

      // Add the download chapter option
      menuItems.push(
        <Menu.Item
          name='chapter_download_docx'
          onClick={downloadChapter}
          key='chapter_download_docx'
        >
          Download chapter
        </Menu.Item>
      );

    if(contextType === CONTEXT_VERSE || contextType === CONTEXT_WORD ){
      if(contextData.verse) {
        menuItems.push(
          <Menu.Item
            name='verse_clipboard'
            onClick={copyVerseToClipboard}
            key='verse_clipboard'
          >
            Copy verse
          </Menu.Item>
        );
      }

      menuItems.push(
        <Menu.Item
          name='link_clipboard'
          onClick={copyLinkToClipboard}
          key='link_clipboard'
        >
          Copy link
        </Menu.Item>
      );

      if(features.userNotesEnabled && authentication.authenticated) {
        menuItems.push(
          <Menu.Item
            name='create_user_note'
            onClick={createUserNote}
            key='create_user_note'
          >
            View or create notes
          </Menu.Item>
        );
      }
    }

    if(contextType === CONTEXT_WORD){
      menuItems.push(
        <Menu.Item
          name='search_this_work'
          onClick={searchThisWork}
          key='search_this_work'
        >
          Search for this word in this work
        </Menu.Item>
      );

      menuItems.push(
        <Menu.Item
          name='search_all_works'
          onClick={searchAllWorks}
          key='search_all_works'
        >
          Search for this word in all works
        </Menu.Item>
      );
    }

    return menuItems;

  }

  // Get the list of items to render
  const menuItems = getMenuItems();

  // Determine the height
  const height = 16 + (menuItems.length * 43);

  if (userNoteDialogOpen) {
    return (
      <UserNoteDialog
        onClose={onClose}
        work={data.work.title_slug}
        division={getDivisionReference(contextData.verse)}
      />
    )
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
      maxHeight={height}
      frameless
    >
      <div>
        <Menu style={{ width: '100%' }} inverted={inverted} vertical>
          {menuItems}
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
  history: PropTypes.object.isRequired,
};

ContextPopup.defaultProps = {
  positionBelow: true,
  positionRight: true,
  inverted: false,
};

export default withRouter(ContextPopup);
