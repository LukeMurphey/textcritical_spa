import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { getPositionRecommendation } from '../PopupDialog';
import './Chapter.css';

/**
 * This class renders the content of chapter of a work.
 *
 * render() is going to use an unsafe method of rendering HTML. This is unfortunate but necessary.
 * The reason is that the works are persisted in a preformatted state in order to improve
 * performance. The alternative is to parse the XML on the client-side and process it into
 * HTML. This would mean that the content could not be cached. Right now, the server preprocesses
 * the content into HTML chunks and then caches so that it can be loaded quickly.
 */
class Chapter extends Component {
  constructor(props) {
    super(props);

    // We need to track the event listener with the bind call so that it can be removed
    // See https://dev.to/em4nl/function-identity-in-javascript-or-how-to-remove-event-listeners-properly-1ll3
    this.clickListener = null;
  }

  /**
   * Wire up handlers for the clicking of the words and verses.
   */
  componentDidMount() {
    this.clickListener = (event) => this.handleClick(event);
    this.addHandler(this.clickListener);
  }

  /**
   * Un wire the handlers to save memory.
   */
  componentWillUnmount() {
    this.removeHandler(this.clickListener);
  }

  /**
   * Get the text for the node separated into lines.
   *
   * @param {object} element The element to get the text from
   */
  getText(element) {
    try {
      const children = [];

      // If the node is text, then add the line
      if (element.nodeType === 3) {
        if (element.textContent && element.textContent.length > 0) {
          children.push(element.textContent);
        }
      }

      // Accumulate the children entries
      const childEntries = Array.from(element.childNodes).reduce(
        (accum, child) => accum.concat(...this.getText(child)),
        [],
      );

      children.push(...childEntries);

      // Return the content
      if (children) {
        return children;
      }
    } catch (err) {
      // If an exception happens, then just use the text content
      return [element.textContent];
    }

    return [element.textContent];
  }

  addHandler(handler, type = 'click') {
    this.wrapper.current.addEventListener(type, (event) => handler(event));
  }

  removeHandler(handler, type = 'click') {
    if (this.wrapper.current) {
      this.wrapper.current.removeEventListener(type, (event) => handler(event));
    }
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {*} event The event object
   */
  handleClickWord(event) {
    const word = event.target.textContent;
    const { onWordClick } = this.props;

    const [positionRight, positionBelow] = getPositionRecommendation(event);

    onWordClick(word, event.layerX, event.layerY, positionRight, positionBelow);
  }

  /**
   * Unhighlight existing verses.
   */
  unhighlistVerses() {
    const highlights = Array.from(this.wrapper.current.getElementsByClassName('highlighted'));
    highlights.map((highlight) => highlight.classList.remove('highlighted'));
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {*} event The event object
   */
  handleClickVerse(event) {
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

    // Fire off the handler
    const { onVerseClick } = this.props;
    onVerseClick(verseDescriptor, verse, id, href, event.x, event.y);

    // Unhighlight existing verses
    this.unhighlistVerses();

    // Highlight the verse
    target.parentElement.classList.toggle('highlighted');
  }

  /**
   * handle the clicking of a note.
   */
  handleClickNote(event) {
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
    const { onNoteClick } = this.props;
    onNoteClick(contents, id, event.layerX, event.layerY, positionRight, positionBelow);
  }

  handleClickEmpty() {
    const { onClickAway } = this.props;
    onClickAway();
  }

  handleClick(event) {
    // Determine if we are clicking a word, verse, note, or just empty space
    if (event.target.className.includes('word')) {
      this.handleClickWord(event);
    } else if (event.target.className.includes('verse')) {
      this.handleClickEmpty();
      this.handleClickVerse(event);
    } else if (event.target.className.includes('note-tag')) {
      this.handleClickNote(event);
    } else {
      this.handleClickEmpty();
    }
  }

  render() {
    const { content } = this.props;

    // We are keeping a reference to the wrapper so that math can be done regarding client rectangle
    // See https://medium.com/trabe/getting-rid-of-finddomnode-method-in-your-react-application-a0d7093b2660
    this.wrapper = createRef();
    return (
      <>
        <div
          className="view_read_work"
          ref={this.wrapper}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </>
    );
  }
}

Chapter.propTypes = {
  content: PropTypes.string.isRequired,
  onVerseClick: PropTypes.func,
  onWordClick: PropTypes.func,
  onClickAway: PropTypes.func,
  onNoteClick: PropTypes.func,
};

Chapter.defaultProps = {
  onVerseClick: () => { },
  onWordClick: () => { },
  onClickAway: () => { },
  onNoteClick: () => { },
};

export default Chapter;
