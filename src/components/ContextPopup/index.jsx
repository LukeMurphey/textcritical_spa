import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react'
import PopupDialog from '../PopupDialog';
import { getText } from '../Utils';

const ContextPopup = ({
  data, onClose, x, y, positionBelow, positionRight, inverted, contextType, contextData, event,
}) => {

  const convertToPlain = (html) => {

    // Create a new div element
    const tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

  const copyVerseToClipboard = () => {
    const textForVerse = getText(event.target);
    navigator.clipboard.writeText(textForVerse);
  }

  const copyChapterToClipboard = () => {
    navigator.clipboard.writeText(convertToPlain(data.content).replaceAll(/[\n]+/ig, '').replaceAll(/[ ]+/ig, ' '));
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
          <Menu.Item
            name='verse_clipboard'
            onClick={copyVerseToClipboard}
          >
            Copy verse to clipboard
          </Menu.Item>

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
};

ContextPopup.defaultProps = {
  positionBelow: true,
  positionRight: true,
  inverted: false,
};

export default ContextPopup;
