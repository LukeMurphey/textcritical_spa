import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
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

  addHandler(handler, type = 'click') {
    this.wrapper.current.addEventListener(type, (event) => handler(event));
  }

  removeHandler(handler, type = 'click') {
    this.wrapper.current.removeEventListener(type, (event) => handler(event));
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {*} event The event object
   */
  handleClickWord(event) {
    const word = event.target.textContent;
    const { onWordClick } = this.props;

    const rect = this.wrapper.current.getBoundingClientRect();
    const positionRight = event.layerX < (rect.width / 2);
    const positionBelow = event.layerY < (rect.height / 2);

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

    // Unhighlight existing verses
    this.unhighlistVerses();

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

    // Fire off the handler
    const { onVerseClick } = this.props;
    onVerseClick(verseDescriptor, verse, id, href, event.x, event.y);

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
    let contents = 'Note content could not be found';

    if (contentsElem) {
      contents = contentsElem.textContent;
    }

    const rect = this.wrapper.current.getBoundingClientRect();
    const positionRight = event.layerX < (rect.width / 2);
    const positionBelow = event.layerY < (rect.height / 2);

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
