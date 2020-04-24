import React, { createRef, Component } from 'react';
import { findDOMNode } from 'react-dom';
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
  static addHandler(className, handler, type = 'click') {
    let matches = document.getElementsByClassName(className);
    matches = Array.from(matches); // Convert to array
    matches.map((elem) => elem.addEventListener(type, (event) => handler(event)));
  }

  static removeHandler(className, handler, type = 'click') {
    let matches = document.getElementsByClassName(className);
    matches = Array.from(matches); // Convert to array
    matches.map((elem) => elem.removeEventListener(type, (event) => handler(event)));
  }

  constructor(props) {
    super(props);

    // We need to track the event listener with the bind call so that it can be removed
    // See https://dev.to/em4nl/function-identity-in-javascript-or-how-to-remove-event-listeners-properly-1ll3
    this.clickWordListener = null;
    this.clickVerseListener = null;
    this.node = null;
  }

  /**
   * Wire up handlers for the clicking of the words and verses.
   */
  componentDidMount() {
    this.clickWordListener = (event) => this.handleClickWord(event);
    Chapter.addHandler('word', this.clickWordListener);

    this.clickVerseListener = (event) => this.handleClickVerse(event);
    Chapter.addHandler('verse-link', (event) => this.handleClickVerse(event));
  }

  /**
   * Un wire the handlers to save memory.
   */
  componentWillUnmount() {
    Chapter.removeHandler('word', this.clickWordListener);
    Chapter.removeHandler('verse-link', this.clickVerseListener);
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {*} event The event object
   */
  handleClickWord(event) {
    const word = event.currentTarget.textContent;
    const { onWordClick } = this.props;

    const rect = this.wrapper.current.getBoundingClientRect();
    const positionRight = event.layerX < (rect.width / 2);
    const positionBelow = event.layerY < (rect.height / 2);

    onWordClick(word, event.layerX, event.layerY, positionRight, positionBelow);
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {*} event The event object
   */
  handleClickVerse(event) {
    // Don't follow the link
    event.preventDefault();

    // Get the descriptor of the verse
    const verseDescriptorElem = Array.from(event.currentTarget.attributes).find((element) => element.name === 'data-verse-descriptor');
    const verseDescriptor = verseDescriptorElem ? verseDescriptorElem.nodeValue : null;

    // Get the ID and the href
    const { id, href } = event.currentTarget;

    // Get the verse number
    const verseElem = Array.from(event.currentTarget.attributes).find((element) => element.name === 'data-verse');
    const verse = verseElem ? verseElem.nodeValue : null;

    // Fire off the handler
    const { onVerseClick } = this.props;
    onVerseClick(verseDescriptor, verse, id, href, event.x, event.y);
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
};

Chapter.defaultProps = {
  onVerseClick: () => { },
  onWordClick: () => { },
};

export default Chapter;
