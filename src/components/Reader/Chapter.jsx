import React, { createRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import getDomReplaceFunction from './ChapterDomReplacer';
import { getPositionRecommendation } from '../PopupDialog';
import { getAbsolutePosition } from '../Utils';
import './Chapter.scss';

/**
 * This class renders the content of chapter of a work.
 *
 * render() is going to parse some HTML it gets from the server and then present it.
 * The reason is that the works are persisted in a preformatted state in order to improve
 * performance. The alternative is to parse the XML on the client-side and process it into
 * HTML. This would mean that the content could not be cached. Right now, the server pre-processes
 * the content into HTML chunks and then caches so that it can be loaded quickly.
 */
const Chapter = ( {content, highlightedVerse, onVerseClick, onNoteClick, onWordClick, onWordHover, onClickAway, highlightedWords, fontSizeAdjustment, verseIdentifierPrefix, inverted} ) => {

    // We need to track the event listener with the bind call so that it can be removed
    // See https://dev.to/em4nl/function-identity-in-javascript-or-how-to-remove-event-listeners-properly-1ll3
  const clickListener = useRef(null);
  const hoverListener = useRef(null);

  // We need to track when a verse was selected for highlight
  const highlightOverridden = useRef(false);

  // We are keeping a reference to the wrapper so that math can be done regarding client rectangle
  // See https://medium.com/trabe/getting-rid-of-finddomnode-method-in-your-react-application-a0d7093b2660
  const wrapper = createRef();

  /**
   * Get the chapter content
   * @param {string} className The class name to put the content under
   */
   const getChapterContent = (className) =>{

    // These options will process the nodes such that the node gets a tag indicating that it is
    // highlighted
    const options = {
      // eslint-disable-next-line react/prop-types
      replace: getDomReplaceFunction(highlightedWords, verseIdentifierPrefix, highlightedVerse),
      condition: (node) => node.className.toLowerCase() === 'word',
      modify: (node) => {
        // eslint-disable-next-line no-param-reassign
        node.className += ' highlighted';
        return node;
      },
    };

    const reactElement = parse(content, options);

    return (
      <div
        className={`${className} fontSize-${fontSizeAdjustment}`}
        ref={wrapper}
      >
        {reactElement}
      </div>
    );
  }

  const addHandler = (handler, type = 'click') =>{
    if (wrapper.current) {
      wrapper.current.addEventListener(type, (event) => handler(event));
    }
  }

  const removeHandler = (handler, type = 'click') =>{
    if (wrapper.current) {
      wrapper.current.removeEventListener(type, (event) => handler(event));
    }
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {*} event The event object
   */
  const handleClickWord = (event) => {
    const word = event.target.textContent;

    const [positionRight, positionBelow] = getPositionRecommendation(event);
    const {x , y} = getAbsolutePosition(event.srcElement);
    onWordClick(word, x, y, positionRight, positionBelow);
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {*} event The event object
   */
  const handleClickVerse = (event) => {
    // Don't follow the link
    event.preventDefault();

    // Get the target containing the verse info
    const target = event.target.parentElement;

    // Get the descriptor of the verse
    const verseDescriptorElem = Array.from(target.attributes).find((element) => element.name === 'data-verse-descriptor');
    const verseDescriptor = verseDescriptorElem ? verseDescriptorElem.nodeValue : null;

    // Get the ID
    const { id } = target;

    // Get the the href
    let href;

    if (target.attributes.href) {
      href = target.attributes.href.nodeValue;
    } else {
      href = null;
    }

    // Get the verse number
    const verseElem = Array.from(target.attributes).find((element) => element.name === 'data-verse');
    const verse = verseElem ? verseElem.nodeValue : null;

    // Stop if we didn't get what we needed to continue
    if (!verseDescriptor) {
      return;
    }

    highlightOverridden.current = true;

    // Fire off the handler
    const {x , y} = getAbsolutePosition(event.srcElement);
    onVerseClick(verseDescriptor, verse, id, href, x, y);
  }

  /**
   * handle the clicking of a note.
   */
  const handleClickNote = (event) => {
    // Get the ID
    const { id } = event.target;

    // Get the contents for the given ID
    const contentsElem = document.getElementById(`content_for_${id}`);
    let contents = ['Note content could not be found'];

    if (contentsElem) {
      contents = [contentsElem.textContent];
    }

    const [positionRight, positionBelow] = getPositionRecommendation(event);

    // Fire off the handler
    const {x , y} = getAbsolutePosition(event.srcElement);
    onNoteClick(contents, id, x, y, positionRight, positionBelow);
  }

  const handleClickEmpty = () =>{
    onClickAway();
  }

  const handleClick = (event) => {
    // Determine if we are clicking a word, verse, note, or just empty space
    if (event.target.className.includes('word')) {
      handleClickWord(event);
    } else if (event.target.className.includes('verse')) {
      handleClickVerse(event);
      handleClickEmpty();
    } else if (event.target.className.includes('note-tag')) {
      handleClickNote(event);
    } else {
      handleClickEmpty();
    }
  }

  /**
   * Handle the case where the user has hovered over a word.
   * @param {*} event 
   */
  const handleHover = (event) => {
    if (event.target.className.includes('word')) {
      onWordHover(event.target.innerText);
    }
    else {
      onWordHover(null);
    }
  }

  useEffect(() => {
    /**
    * Wire up handlers for the clicking of the words and verses.
    */
    clickListener.current = (event) => handleClick(event);
    addHandler(clickListener.current);

    hoverListener.current = (event) => handleHover(event);
    addHandler(hoverListener.current, 'mousemove');

    /**
     * Un wire the handlers to save memory.
     */
    return function cleanup() {
      removeHandler(clickListener.current);
      removeHandler(hoverListener.current, 'mousemove');
    };
  }, []);


  // Determine the class name
  let className = 'view_read_work';

  if (inverted) {
    className = 'view_read_work inverted';
  }

  return (
    <>
      {getChapterContent(className)}
    </>
  );
};

Chapter.propTypes = {
  content: PropTypes.string.isRequired,
  highlightedVerse: PropTypes.string,
  highlightedWords: PropTypes.arrayOf(PropTypes.string),
  onVerseClick: PropTypes.func,
  onWordClick: PropTypes.func,
  onClickAway: PropTypes.func,
  onNoteClick: PropTypes.func,
  onWordHover: PropTypes.func,
  inverted: PropTypes.bool,
  verseIdentifierPrefix: PropTypes.string,
  fontSizeAdjustment: PropTypes.number,
};

Chapter.defaultProps = {
  highlightedVerse: null,
  highlightedWords: null,
  onVerseClick: () => { },
  onWordClick: () => { },
  onClickAway: () => { },
  onNoteClick: () => { },
  onWordHover: () => { },
  inverted: false,
  verseIdentifierPrefix: '',
  fontSizeAdjustment: 0,
};

export default Chapter;
