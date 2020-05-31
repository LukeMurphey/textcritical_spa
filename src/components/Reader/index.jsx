import React, { Component } from 'react';
import {
  Button, Input, Icon, Dropdown, Container, Header, Grid, Placeholder, Segment,
  Message, Menu, Popup, Sidebar, Image, Progress, Responsive,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ENDPOINT_READ_WORK, ENDPOINT_RESOLVE_REFERENCE, ENDPOINT_WORK_IMAGE } from '../Endpoints';
import { SEARCH, READ_WORK } from '../URLs';
import { toTitleCase } from '../Utils';
import Chapter from './Chapter';
import ErrorMessage from '../ErrorMessage';
import AboutWorkDialog from '../AboutWorkDialog';
import AboutDialog from '../AboutDialog';
import WorkDownloadDialog from '../WorkDownloadDialog';
import WordInformation from '../WordInformation/WordInformationPopup';
import FootnotePopup from '../FootnotePopup';
import BookSelection from '../BookSelection';
import NoWorkSelected from './NoWorkSelected';
import LibraryIcon from '../Icons/Library.svg';
import './index.scss';

const MODE_LOADING = 0;
const MODE_ERROR = 1;
const MODE_DONE = 2;
const MODE_NOT_READY = 3;

const NextPageStyle = {
  bottom: '20px',
  right: '20px',
  position: 'fixed',
};

const PriorPageStyle = {
  bottom: '20px',
  left: '20px',
  position: 'fixed',
};

const ContainerStyle = {
  paddingTop: 60,
};

const SidebarStyle = {
  height: '100vh',
  marginTop: 0,
};

const resolveReferenceDebounced = AwesomeDebouncePromise(
  (titleSlug, reference) => fetch(ENDPOINT_RESOLVE_REFERENCE(titleSlug, reference)),
  500,
);

/**
 * Defines how long a division name can get before it is considered long.
 */
const LONG_DIVISION_NAME = 30;

class Reader extends Component {
  /**
   * Determine if the divisions tend to have long names. This is useful for determining if we ought
   * to use the titles or the shorter descriptors.
   *
   * @param {array} divisions The list of divisions.
   */
  static hasLongDivisionNames(divisions) {
    const countLongNames = (accumulator, division) => (
      division.full_title && division.full_title.length > LONG_DIVISION_NAME
        ? accumulator + 1
        : accumulator
    );
    const longNames = divisions.reduce(countLongNames, 0);

    return (longNames > 5 || longNames === divisions.length);
  }

  /**
   * Determine if the division descriptors appear to be names.
   *
   * @param {array} divisions The list of divisions.
   */
  static areDescriptorsNames(divisions) {
    const countIndicators = (accumulator, division) => (
      /^([0-9]+|[IVX]+|[A-Z])$/i.test(division.descriptor) ? accumulator + 1 : accumulator
    );
    const indicators = divisions.reduce(countIndicators, 0);
    return (indicators !== divisions.length);
  }

  /**
   * Get the the division descriptor.
   *
   * @param {array} division The list of divisions.
   * @param {*} useTitles Whether titles ought to be used.
   * @param {*} descriptorsAreNames Whether descriptors appear to be names.
   */
  static getDivisionText(division, useTitles, descriptorsAreNames) {
    // Use the title (from the full_title of the division)
    if (useTitles) {
      return toTitleCase(division.label);
    }
    // Are the descriptors names (like "Matthew" insread of "1")
    if (descriptorsAreNames) {
      return division.descriptor;
    }
    return `${division.type} ${division.descriptor}`;
  }

  /**
   * Convert the list of divisions to options that can be processed by the dropdown menu.
   *
   * @param {array} divisions The list of divisions.
   */
  static convertDivisionsToOptions(divisions) {
    const useTitles = !Reader.hasLongDivisionNames(divisions);
    const descriptorsAreNames = Reader.areDescriptorsNames(divisions);

    return divisions.map((d) => ({
      key: d.description,
      text: Reader.getDivisionText(d, useTitles, descriptorsAreNames),
      value: d.descriptor,
    }));
  }

  /**
   * This function looks for the chapter the user entered. It looks both in the description as well
   * as the key.
   * This is useful because the works often use a Greek name as the description but an English
   * description too and we want both to be searchable (don't want users to have to type Μαρκον).
   * @param {array} options List of dropdown options
   * @param {string} query The string that the user entered that we are searching for
   */
  static workSearch(options, query) {
    const queryLower = query.toLowerCase();
    return options.filter((opt) => (
      opt.text.toLowerCase().includes(queryLower)
      || opt.key.toLowerCase().includes(queryLower)
    ));
  }

  /**
   * Get a placeholder for the content.
   */
  static getPlaceholder(inverted = false) {
    return (
      <div style={{ paddingTop: 16 }}>
        <Placeholder inverted={inverted}>
          <Placeholder.Header>
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      data: null,
      errorTitle: null,
      errorMessage: null,
      errorDescription: null,
      loading: false,
      divisions: null,
      loadedWork: null,
      referenceValid: true,
      referenceValue: '',
      selectedWord: null,
      popupX: null,
      popupY: null,
      redirectedFrom: null,
      redirectedTo: null,
      sidebarVisible: false,
    };

    // This will store the last reference set so that we make sure not to replace the reference
    // we did a reference resolution check against the server for.
    this.lastSetReference = null;

    // Keep a list of the verses so that we can know what chapter the verse is assopciated with.
    // This is needed so that we don't force a reload just to get the same chapter.
    this.verseReferences = {};
  }

  componentDidMount() {
    const {
      defaultWork,
      division0,
      division1,
      division2,
      division3,
      division4,
      leftovers,
    } = this.props;

    const divisions = [
      division0,
      division1,
      division2,
      division3,
      division4,
      leftovers,
    ].filter((entry) => entry);

    if (defaultWork) {
      this.loadChapter(defaultWork, ...divisions);
    }
  }

  /**
   * Handle a component update in order to load a new chapter if the user changed navigation
   * based on the browsers back/forward buttons.
   *
   * @param {object} prevProps The previous properties
   */
  componentDidUpdate(prevProps) {
    const { location, match } = this.props;
    const { redirectedTo, data, highlightedVerse } = this.state;

    // See if we know that this is a reference to this chapter
    const existingChapter = this.verseReferences[location.pathname];

    // Check if the chapter we have loaded already
    if (data && data.chapter && existingChapter
      && existingChapter.chapter === data.chapter.full_descriptor) {
      // Get the highlighted verse
      const highlightedVerseRef = existingChapter.verse;

      if (highlightedVerse !== highlightedVerseRef) {
        this.setState({
          highlightedVerse: highlightedVerseRef,
          referenceValue: existingChapter.referenceValue,
        });
      }

      // Don't load the new one, we already have it on the page!
      return;
    }

    // Determine if the page changed
    if (location.pathname !== prevProps.location.pathname && redirectedTo !== location.pathname) {
      const divisions = [
        match.params.division0,
        match.params.division1,
        match.params.division2,
        match.params.division3,
        match.params.division4,
        match.params.leftovers,
      ].filter((entry) => entry);
      this.loadChapter(match.params.work, ...divisions);
    }
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {string} verseDescriptor A descripion of the verse (e.g. "John 8:4")
   * @param {string} verse The verse number (e.g. "4")
   * @param {string} id An ID that designates the verse in the HTML DOM
   * @param {string} href A href for the verse (e.g. "/work/new-testament/John/8/4")
   * @param {int} x The x coordinate of the verse marker
   * @param {int} y The y coordinate of the verse marker
   */
  onVerseClick(verseDescriptor, verse, id, href) {
    const { data } = this.state;

    // Add the verse to the list
    this.addVerseToHistoryList(href, data.chapter.full_descriptor, verse, verseDescriptor);

    this.setState({
      referenceValue: verseDescriptor,
      referenceValid: true,
    });

    const { history } = this.props;

    history.push(href);
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {string} word The word to get information on
   * @param {int} x The x coordinate designating where to show the popup
   * @param {int} y The y coordinate designating where to show the popup
   * @param {bool} positionRight Indicates it is best to show the popup to the right of the offset
   * @param {bool} positionBelow Indicates it is best to show the popup below the offset
   */
  onWordClick(word, x, y, positionRight, positionBelow) {
    this.setState({
      selectedWord: word,
      modal: 'word',
      popupX: x,
      popupY: y,
      popupPositionRight: positionRight,
      popupPositionBelow: positionBelow,
    });
  }

  /**
   * Handle the clicking of a note.
   *
   * @param {string} note The note's contents
   * @param {string} id The ID of the note
   * @param {int} x The x coordinate designating where to show the popup
   * @param {int} y The y coordinate designating where to show the popup
   * @param {bool} positionRight Indicates it is best to show the popup to the right of the offset
   * @param {bool} positionBelow Indicates it is best to show the popup below the offset
   */
  onNoteClick(note, id, x, y, positionRight, positionBelow) {
    this.setState({
      selectedNote: note,
      modal: 'note',
      popupX: x,
      popupY: y,
      popupPositionRight: positionRight,
      popupPositionBelow: positionBelow,
    });
  }

  /**
   * Handle the selection of a work.
   * @param {string} work the title slug of a work to load
   */
  onSelectWork(work) {
    this.navigateToChapter(work);
  }

  /**
   * Accept the enter key as a jumop to execute the reference jump.
   * @param {object} event The event from the key press.
   */
  onKeyPressed(event) {
    if (event.key === 'Enter') {
      this.goToReference();
    }
  }

  /**
   * Open or close the book selection dialog.
   * @param {bool} open Whether the dialog for selecting a book ought to be open.
   */
  setBookSelectionOpen(open = true) {
    this.setState({
      bookSelectionOpen: open,
    });
  }

  /**
   * Set an error state.
   *
   * @param {string} errorTitle The title
   * @param {string} errorDescription The description
   * @param {string} errorMessage The detailed error message (like from an AJAX call)
   */
  setErrorState(errorTitle, errorDescription = '', errorMessage = null) {
    this.setState({
      errorMessage,
      errorDescription,
      errorTitle,
    });
  }

  /**
   * Opens or closes the sidebar.
   * @param {bool} visible Whether the sidebad should be open.
   */
  setSidebarVisible(visible = true) {
    this.setState({
      sidebarVisible: visible,
    });
  }

  /**
   * Add the href to the list so that we can remember what URL is capable of loading it.
   * @param {string} href The partial URL of the page (e.g. "/work/new-testament/John/8/4")
   * @param {string} chapter The chapter descriptor (e.g. "John/9")
   */
  addVerseToHistoryList(href, chapter, verse, referenceValue) {
    this.verseReferences[href] = {
      chapter,
      verse,
      referenceValue,
    };
  }

  /**
   * Update the history but only if it has changed.
   *
   * @param {str} work The title slug of the work
   * @param  {...any} divisions The list of division indicators
   */
  updateHistory(work, ...divisions) {
    const { history, location } = this.props;

    // Get the URL
    const workUrl = READ_WORK(work, ...divisions);

    // Determine if the URL is already set
    // Note that we need to check redirectedFrom because the URL might not match because we were
    // redirected since a work had been renamed.
    if (workUrl === location.pathname) {
      return false;
    }

    history.push(workUrl);
    return true;
  }

  /**
   * Navigate to chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  navigateToChapter(work, ...divisions) {
    this.updateHistory(work, ...divisions);
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  loadChapter(work, ...divisions) {
    this.setState({
      loading: true,
      bookSelectionOpen: false,
      modal: null,
      errorTitle: null,
      errorMessage: null,
      errorDescription: null,
      redirectedFrom: null,
      redirectedTo: null,
      highlightedVerse: null,
    });

    fetch(ENDPOINT_READ_WORK(work, ...divisions))
      .then((res) => (Promise.all([res.status, res.json()])))
      .then(([status, data]) => {
        if (status >= 200 && status < 300) {
          let redirectedFrom = null;
          let redirectedTo = null;

          // If the work alias didn't match, then update the URL accordingly
          if (data.work.title_slug !== work) {
            redirectedFrom = READ_WORK(work, ...divisions);
            redirectedTo = READ_WORK(data.work.title_slug, ...divisions);
          }

          this.setState({
            data,
            loading: false,
            loadedWork: data.work.title_slug,
            divisions,
            referenceValue: data.reference_descriptor,
            referenceValid: true,
            redirectedFrom,
            redirectedTo,
            highlightedVerse: data.verse_to_highlight,
          });

          // Add the verse to the list
          this.addVerseToHistoryList(
            READ_WORK(work, ...divisions),
            data.chapter.full_descriptor,
            data.verse_to_highlight,
            data.chapter.description,
          );

          // Update the URL if we were redirected
          if (redirectedFrom) {
            this.updateHistory(data.work.title_slug, ...divisions);
          }

          // Preload the next chapter so that it is cached
          this.preloadNextChapter();
        } else {
          this.setErrorState(
            'Work could not be found',
            'Yikes. The given work is not recognized as a valid work.',
          );
        }
      })
      .catch((e) => {
        this.setErrorState(
          'Unable to load the content',
          'The given chapter could not be loaded from the server',
          e.toString(),
        );
      });
  }

  /**
   * Preload the next chapter.
   */
  preloadNextChapter() {
    const { data, loadedWork } = this.state;

    if (data.next_chapter) {
      fetch(ENDPOINT_READ_WORK(`${loadedWork}/${data.next_chapter.full_descriptor}`));
    }
  }

  /**
   * Preload the prior chapter.
   */
  preloadPriorChapter() {
    const { data, loadedWork } = this.state;

    if (data.previous_chapter) {
      fetch(ENDPOINT_READ_WORK(`${loadedWork}/${data.previous_chapter.full_descriptor}`));
    }
  }

  /**
   * Open the about modal.
   */
  openAboutModal() {
    this.setState({ modal: 'about' });
  }

  /**
   * Preload the next and prior chapter
   */
  preloadChapters() {
    this.preloadNextChapter();
    this.preloadPriorChapter();
  }

  /**
   * Close any open modal.
   */
  closeModal() {
    this.setState({ modal: null });
  }

  /**
   * Open the info modal.
   */
  openWorkInfoModal() {
    this.setState({ modal: 'aboutWork' });
  }

  /**
   * Go to the search page.
   */
  openSearch() {
    const { history } = this.props;

    const { loadedWork } = this.state;
    const q = `work:${loadedWork}`;
    history.push(SEARCH(q));
  }

  /**
   * Open the modal for downloading a work.
   */
  openDownloadModal() {
    this.setState({ modal: 'downloadWork' });
  }

  /**
   * Change the work to another related work.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  changeWork(work) {
    const { divisions } = this.state;
    this.navigateToChapter(work, ...divisions);
  }

  /**
   * Handle the selection of the division.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  changeChapter(event, info) {
    const { loadedWork } = this.state;
    this.navigateToChapter(loadedWork, info.value);
  }

  /**
   * Handle a change in the reference input.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  changeReference(event, info) {
    const { loadedWork } = this.state;

    // Stop if we have nothing to lookup
    if (!loadedWork || !info.value) {
      return;
    }

    this.setState({
      referenceValue: info.value,
      referenceValid: true,
    });

    // Store this entry so that we can avoid updating the reference if the user entered another
    // reference before the server's response came back
    this.lastSetReference = info.value;

    resolveReferenceDebounced(loadedWork, info.value)
      .then((res) => (Promise.all([res.status, res.json()])))
      .then(([status, referenceInfo]) => {
        // If the user already changed the value again, just ignore it
        if (this.lastSetReference !== info.value) {
          return;
        }

        if (status === 200) {
          this.setState({
            divisions: referenceInfo.divisions,
            referenceValue: info.value,
            referenceValid: true,
          });
        } else {
          this.setState({
            referenceValue: info.value,
            referenceValid: false,
          });
        }
      })
      .catch((e) => {
        this.setErrorState(
          'Unable to load the content',
          'The given chapter could not be loaded from the server',
          e.toString(),
        );
      });
  }

  /**
   * Go to the reference defined in the input box.
   */
  goToReference() {
    const { loadedWork, referenceValue } = this.state;

    // Stop if we have no where to go
    if (!loadedWork || !referenceValue) {
      return;
    }

    // Verify the reference is valid before going to it
    fetch(ENDPOINT_RESOLVE_REFERENCE(loadedWork, referenceValue))
      .then((res) => (Promise.all([res.status, res.json()])))
      .then(([status, referenceInfo]) => {
        if (status === 200) {
          this.setState({
            divisions: referenceInfo.divisions,
            referenceValue,
            referenceValid: true,
          });

          this.navigateToChapter(loadedWork, ...referenceInfo.divisions);
        } else {
          this.setState({
            referenceValue,
            referenceValid: false,
          });
        }
      })
      .catch((e) => {
        this.setErrorState(
          'Unable to load the content',
          'The given chapter could not be loaded from the server',
          e.toString(),
        );
      });
  }

  /**
   * Go to the next chapter.
   */
  goToNextChapter() {
    const { data, loadedWork } = this.state;
    if (data.next_chapter) {
      this.navigateToChapter(loadedWork, data.next_chapter.full_descriptor);
    }
  }

  /**
   * Go to the prior chapter.
   */
  goToPriorChapter() {
    const { data, loadedWork } = this.state;
    if (data.previous_chapter) {
      this.navigateToChapter(loadedWork, data.previous_chapter.full_descriptor);
    }
  }

  getPopups() {
    const {
      modal, data, loading, selectedWord, popupX, popupY, popupPositionRight, popupPositionBelow,
      selectedNote, loadedWork,
    } = this.state;

    const { inverted } = this.props;

    return (
      <>
        {data && !loading && modal === 'word' && (
          <WordInformation
            inverted={inverted}
            positionBelow={popupPositionBelow}
            positionRight={popupPositionRight}
            x={popupX}
            y={popupY}
            word={selectedWord}
            work={loadedWork}
            onClose={() => this.closeModal()}
          />
        )}
        {data && !loading && modal === 'note' && (
          <FootnotePopup
            inverted={inverted}
            positionBelow={popupPositionBelow}
            positionRight={popupPositionRight}
            x={popupX}
            y={popupY}
            notes={selectedNote}
            onClose={() => this.closeModal()}
          />
        )}
      </>
    );
  }

  getDialogs() {
    const {
      modal, data, loading, loadedWork,
    } = this.state;

    return (
      <>
        {data && !loading && modal === 'aboutWork' && (
          <AboutWorkDialog
            work={loadedWork}
            onClose={() => this.closeModal()}
          />
        )}
        {data && !loading && modal === 'downloadWork' && (
          <WorkDownloadDialog
            work={loadedWork}
            onClose={() => this.closeModal()}
          />
        )}
      </>
    );
  }

  render() {
    const {
      modal, data, errorDescription, loading, referenceValid, referenceValue, bookSelectionOpen,
      errorTitle, errorMessage, redirectedFrom, sidebarVisible, loadedWork, highlightedVerse,
    } = this.state;

    const { inverted } = this.props;

    const onVerseClick = (verseDescriptor, verse, id, href, x, y) => {
      this.onVerseClick(verseDescriptor, verse, id, href, x, y);
    };

    const onWordClick = (word, x, y, positionRight, positionBelow) => {
      this.onWordClick(word, x, y, positionRight, positionBelow);
    };

    const onNoteClick = (word, x, y, positionRight, positionBelow) => {
      this.onNoteClick(word, x, y, positionRight, positionBelow);
    };

    // Figure out a description for the chapter
    let description = '';
    let referenceDescription = referenceValue;

    if (data) {
      description = data.chapter.description;

      if (referenceValue === '') {
        referenceDescription = description;
      }
    }

    // Create a custom className for signaling the desire to switch to inverted
    let classNameSuffix = '';

    if (inverted) {
      classNameSuffix = ' inverted';
    }

    // Determine what we ought to be rendering
    let mode = MODE_LOADING;

    if (data && !loading) {
      mode = MODE_DONE;
    } else if (errorTitle) {
      mode = MODE_ERROR;
    } else if (loading && !errorTitle) {
      mode = MODE_LOADING;
    } else {
      mode = MODE_NOT_READY;
    }

    // Get the list of related works so that the book selector can put the related ones at the top
    const relatedWorks = data && data.related_works ? data.related_works : [];

    return (
      <>
        <Menu inverted={inverted} style={{ zIndex: 103 }} className={`control ${classNameSuffix}`} fixed="top">
          <Container>
            <Menu.Item
              name="works"
              onClick={() => this.setSidebarVisible(true)}
            >
              <Icon name="bars" />
            </Menu.Item>
            <Popup
              content={<BookSelection relatedWorks={relatedWorks} onSelectWork={(work) => this.onSelectWork(work)} />}
              on="click"
              position="bottom left"
              pinned
              onClose={() => this.setBookSelectionOpen(false)}
              onOpen={() => this.setBookSelectionOpen(true)}
              open={bookSelectionOpen}
              trigger={(
                <Menu.Item
                  name="Library"
                >
                  <img style={{ width: 16 }} src={LibraryIcon} alt="Library" />
                </Menu.Item>
              )}
            />
            <Menu.Item>
              <Input
                inverted={inverted}
                className="referenceJumpInput"
                action={
                  (
                    <Button
                      disabled={!referenceValid}
                      inverted={inverted}
                      onClick={() => this.goToReference()}
                      basic
                    >
                      Go
                    </Button>
                  )
                }
                placeholder="Jump to reference..."
                value={referenceDescription}
                error={!referenceValid}
                onChange={(e, d) => this.changeReference(e, d)}
                onKeyPress={(e, d) => this.onKeyPressed(e, d)}
              />
            </Menu.Item>
            <Responsive minWidth={768}>
              <Menu.Menu position="left">
                <Dropdown
                  text="Other Versions"
                  inverted={inverted}
                  disabled={!referenceValid || !data || data.related_works.length === 0}
                  className="otherVersions"
                  item
                >
                  <Dropdown.Menu>
                    {data && data.related_works.map((work) => (
                      <Dropdown.Item
                        key={work.title_slug}
                        text={work.title}
                        description={work.language}
                        onClick={() => this.changeWork(work.title_slug)}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            </Responsive>
            <div style={{ float: 'right', marginLeft: 'auto', marginTop: 11 }}>
              <Responsive minWidth={768}>
                <Dropdown icon="ellipsis vertical" direction="left">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text="About TextCritical.net"
                      onClick={() => this.openAboutModal()}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Responsive>
            </div>
          </Container>
          {mode === MODE_DONE && (
            <>
              <Button
                icon
                inverted={inverted}
                style={PriorPageStyle}
                className={`priorPage ${classNameSuffix}`}
                disabled={data.previous_chapter === null}
                onClick={() => this.goToPriorChapter()}
              >
                <Icon name="left chevron" />
              </Button>
              <Button
                icon
                inverted={inverted}
                style={NextPageStyle}
                className={`nextPage ${classNameSuffix}`}
                disabled={data.next_chapter === null}
                onClick={() => this.goToNextChapter()}
              >
                <Icon name="right chevron" />
              </Button>
            </>
          )}
        </Menu>
        {mode === MODE_DONE && (
          <>
            <Sidebar
              as={Menu}
              animation="overlay"
              icon="labeled"
              style={{ width: 200, paddingTop: 50 }}
              inverted
              visible={sidebarVisible}
              onHide={() => this.setSidebarVisible(false)}
              vertical
              width="thin"
            >
              <Image src={ENDPOINT_WORK_IMAGE(loadedWork, 400)} />
              <Menu.Item as="a" onClick={() => this.openWorkInfoModal()}>
                Information
              </Menu.Item>
              <Menu.Item as="a" onClick={() => this.openDownloadModal()}>
                Download
              </Menu.Item>
              <Menu.Item as="a" onClick={() => this.openSearch()}>
                Search
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pushable as={Segment} basic style={SidebarStyle} className={`${classNameSuffix}`}>
              <Sidebar.Pusher>
                <Container className={`underMenu ${classNameSuffix}`} basic>
                  {this.getDialogs()}
                  {this.getPopups()}
                  <Grid inverted={inverted}>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <Header inverted={inverted} floated="left" as="h3">
                          {data.chapter.parent_division && (
                            <>
                              <Dropdown
                                inline
                                floating
                                deburr
                                scrolling
                                search={Reader.workSearch}
                                options={Reader.convertDivisionsToOptions(data.divisions)}
                                value={data.chapter.parent_division.descriptor}
                                onChange={(event, info) => this.changeChapter(event, info)}
                              />
                              <div style={{ display: 'inline-block', paddingLeft: 6 }}>
                                {data.chapter.type}
                                {` ${data.chapter.descriptor}`}
                              </div>
                            </>
                          )}
                        </Header>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Container textAlign="right">
                          <Header inverted={inverted} floated="right" as="h3">{data.work.title}</Header>
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <div style={{ marginTop: 6 }} />
                  {data && data.warnings.map((warning) => (
                    <Message
                      className={classNameSuffix}
                      warning
                      key={warning[0]}
                      header={warning[0]}
                      content={warning[1]}
                    />
                  ))}
                  {redirectedFrom && (
                  <Message info className={classNameSuffix}>
                    <p>
                      The URL you were using was old so you were redirected to the new one.
                      You may want to update your shortcuts.
                    </p>
                  </Message>
                  )}
                  {data.total_chapters > 1 && data.total_chapters_in_book > 1 && (
                    <>
                      <Segment.Group horizontal style={{ border: 0, marginBottom: 4 }} className={`${classNameSuffix}`}>
                        <Segment basic inverted style={{ padding: 0 }}>
                          {data.completed_chapters_in_book}
                          {' '}
                          of
                          {' '}
                          {data.total_chapters_in_book}
                          {' '}
                          chapters
                          {' '}
                        </Segment>
                        <Segment basic inverted style={{ textAlign: 'right', padding: 0 }}>
                          {Math.round(data.progress_in_book)}
                          % through the book
                        </Segment>
                      </Segment.Group>
                      <Progress className="bookProgress" color="blue" style={{ margin: '0 0 8px 0' }} percent={data.progress_in_book} size="tiny" />
                    </>
                  )}

                  <Chapter
                    chapter={data.chapter}
                    content={data.content}
                    work={data.work}
                    onVerseClick={onVerseClick}
                    onWordClick={onWordClick}
                    onNoteClick={onNoteClick}
                    onClickAway={() => this.closeModal()}
                    highlightedVerse={highlightedVerse}
                    inverted={inverted}
                  />
                </Container>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </>
        )}
        {mode === MODE_ERROR && (
          <Container style={ContainerStyle} className={`${classNameSuffix}`}>
            <ErrorMessage
              inverted={inverted}
              title={errorTitle}
              description={errorDescription}
              message={errorMessage}
            />
          </Container>
        )}
        {mode === MODE_LOADING && (
          <Container style={ContainerStyle} className={`${classNameSuffix}`} basic>
            {Reader.getPlaceholder(inverted)}
          </Container>
        )}
        {mode === MODE_NOT_READY && (
          <Container style={ContainerStyle} className={`${classNameSuffix}`} basic>
            <div style={{ paddingTop: 24 }}>
              <NoWorkSelected onClick={() => this.setBookSelectionOpen()} inverted={inverted} />
            </div>
          </Container>
        )}
        {modal === 'about' && (
          <AboutDialog onClose={() => this.closeModal()} />
        )}
      </>
    );
  }
}

Reader.propTypes = {
  inverted: PropTypes.bool,
  defaultWork: PropTypes.string,
  division0: PropTypes.string,
  division1: PropTypes.string,
  division2: PropTypes.string,
  division3: PropTypes.string,
  division4: PropTypes.string,
  leftovers: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};

Reader.defaultProps = {
  inverted: false,
  defaultWork: null,
  division0: null,
  division1: null,
  division2: null,
  division3: null,
  division4: null,
  leftovers: null,
};

export default withRouter(Reader);
