import React, { Component } from "react";
import { Container, Header, Grid, Segment, Sidebar, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { ENDPOINT_READ_WORK } from "../Endpoints";
import { setWorkProgress } from "../Settings";
import { SEARCH, READ_WORK } from "../URLs";
import { getPlaceholder, getDialogs, getPopups }  from "./shortcuts";
import Chapter from "./Chapter";
import ErrorMessage from "../ErrorMessage";
import AboutDialog from "../AboutDialog";
import NoWorkSelected from "./NoWorkSelected";
import "./index.scss";
import FavoriteWorks from "../FavoriteWorks";
import BookProgress from "./BookProgress";
import BookSidebar from "./BookSidebar";
import ReadingMenuBar from "./ReadingMenuBar";
import ChapterHeader from "./ChapterHeader";
import StaleURLMessage from "./StaleURLMessage";
import WarningMessages from "./WarningMessages";

/**
 * Below are some notes about how this works:
 *   * componentDidUpdate() will trigger the fetch of the work as necessary when the URL changes.
 *   * loadChapter() will fetch the chapter and load it into the UI.
 */

const MODE_LOADING = 0;
const MODE_ERROR = 1;
const MODE_DONE = 2;
const MODE_NOT_READY = 3;

const PARALLEL_WORK_PREFIX = 'secondWork-';

const ContainerStyle = {
  paddingTop: 60,
};

const SidebarStyle = {
  height: "100vh",
  marginTop: 0,
};

class Reader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      data: null,
      secondWorkData: null,
      secondWork: null,
      errorTitle: null,
      errorMessage: null,
      errorDescription: null,
      loading: false,
      divisions: null,
      loadedWork: null,
      referenceValue: "",
      selectedWord: null,
      popupX: null,
      popupY: null,
      redirectedFrom: null,
      redirectedTo: null,
      sidebarVisible: false,
    };

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

    // Determine if we are to open a parallel work
    const parallelWork = this.getSecondWorkParameter();

    if (parallelWork) {
      this.setState({
        secondWork: parallelWork,
      });
      this.loadSecondWorkChapter(parallelWork, ...divisions);
    }

    // Load the work
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
    const { redirectedTo, data, highlightedVerse, loadedWork, secondWork } = this.state;

    // Get the divisions from the URL
    const divisions = [
      match.params.division0,
      match.params.division1,
      match.params.division2,
      match.params.division3,
      match.params.division4,
      match.params.leftovers,
    ].filter((entry) => entry);

    // See if we have loaded the same work
    const sameSecondWork = secondWork === this.getSecondWorkParameter();

    // See if we know that this is a reference to this chapter
    const existingChapter = this.verseReferences[location.pathname];

    // Check if the chapter we have loaded already
    // This needs to check the loaded work too, since we need to recognize if we the reference is
    // the same reference but in a different work.
    const isReferenceForSameChapter = data &&
      data.chapter &&
      existingChapter &&
      existingChapter.chapter === data.chapter.full_descriptor &&
      loadedWork &&
      loadedWork === match.params.work;

    // Check if the chapter we have loaded already
    // This needs to check the loaded work too, since we need to recognize if we the reference is
    // the same reference but in a different work.
    if (isReferenceForSameChapter && sameSecondWork) {
      // Get the highlighted verse
      const highlightedVerseRef = existingChapter.verse;

      if (highlightedVerse !== highlightedVerseRef) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          highlightedVerse: highlightedVerseRef,
          referenceValue: existingChapter.referenceValue,
        });
      }

      // Don't load the new one, we already have it on the page
      return;
    }

    // Determine if the page changed
    if (
      (location.pathname !== prevProps.location.pathname &&
      redirectedTo !== location.pathname)
    ) {
      this.loadChapter(match.params.work, ...divisions);
      return;
    }

    // Try to get the second work
    if (!sameSecondWork) {
      if(this.getSecondWorkParameter()) {
        this.loadSecondWorkChapter(this.getSecondWorkParameter(), divisions);
      }
      else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          secondWork: null,
          secondWorkData: null,
        })
      }
    }
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {string} verseDescriptor A descripion of the verse (e.g. "John 8:4")
   * @param {string} verse The verse number (e.g. "4")
   * @param {string} id An ID that designates the verse in the HTML DOM
   * @param {string} href A href for the verse (e.g. "/work/new-testament/John/8/4")
   */
  onVerseClick(verseDescriptor, verse, id, href) {
    const { data, secondWork } = this.state;

    // Add the verse to the list
    this.addVerseToHistoryList(
      href,
      data.chapter.full_descriptor,
      verse,
      verseDescriptor
    );

    this.setState({
      referenceValue: verseDescriptor,
    });

    const { history } = this.props;
    // Add the parallel work
    if (secondWork) {
      history.push(`${href}?parallel=${secondWork}`);
    } else {
      history.push(href);
    }
  }

  /**
   * Handle the clicking of a verse of a second work.
   *
   * @param {string} verseDescriptor A descripion of the verse (e.g. "John 8:4")
   * @param {string} verse The verse number (e.g. "4")
   * @param {string} id An ID that designates the verse in the HTML DOM
   */
  onVerseClickSecondWork(verseDescriptor, verse, id) {
    // Find the verse descriptor from the first work
    const firstWorkVerse = document.getElementById(id);

    // Fire the associated handler
    // This may not match for works that have more verses in the parallel work than the primary one
    if(firstWorkVerse) {
      this.onVerseClick(verseDescriptor, verse, firstWorkVerse.attributes.id, firstWorkVerse.attributes.href.value);
    }
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
      modal: "word",
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
      modal: "note",
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
    const { data, divisions, loadedWork } = this.state;
    const { history, location } = this.props;
    let isRelated = false;

    // See if this is a related work
    if (data && data.related_works) {
      isRelated = data.related_works.find(
        (relatedWork) => relatedWork.title_slug === work
      );
    }

    // If this is related work, then use the same divisions
    if (isRelated && work !== loadedWork) {
      this.setState({ bookSelectionOpen: false });
      this.loadSecondWorkChapter(work, ...divisions);

      history.push({
        pathname: location.pathname,
        search: `?parallel=${work}`
      })
    } else {
      // Drop the second work since this one is not related
      this.setState({ secondWork: null, secondWorkData: null });
      this.navigateToChapter(work);
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
  setErrorState(errorTitle, errorDescription = "", errorMessage = null) {
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
   * Get the parameter of the second work to be loaded.
   */
  getSecondWorkParameter() {
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    return params.get('parallel');
  }

  /**
   * Opens or closes the sidebar.
   */
  toggleSidebarVisible() {
    const { sidebarVisible } = this.state;
    this.setState({
      sidebarVisible: !sidebarVisible,
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
   * @param {str} secondWork The title slug of the second work to load work
   * @param  {...any} divisions The list of division indicators
   */
  updateHistory(work, secondWork, ...divisions) {
    const { history, location } = this.props;

    const parallelWork = this.getSecondWorkParameter();

    // Get the URL
    const workUrl = READ_WORK(work, ...divisions);

    // Determine if the URL is already set
    // Note that we need to check redirectedFrom because the URL might not match because we were
    // redirected since a work had been renamed.
    if (workUrl === location.pathname && parallelWork === secondWork) {
      return false;
    }

    // Add the parallel work
    if (secondWork) {
      history.push({
        pathname: workUrl,
        search: `?parallel=${secondWork}`
      })
    } else {
      history.push(workUrl);
    }

    return true;
  }

  /**
   * Navigate to chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  navigateToChapter(work, ...divisions) {
    const { secondWork } = this.state;
    this.updateHistory(work, secondWork, ...divisions);
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  loadChapter(work, ...divisions) {
    // Load the start page if there is no work to load
    if (!work) {
      this.setState({
        bookSelectionOpen: false,
        modal: null,
        errorTitle: null,
        errorMessage: null,
        errorDescription: null,
        redirectedFrom: null,
        redirectedTo: null,
        highlightedVerse: null,
        data: null,
        loading: false,
        loadedWork: null,
        divisions: null,
        referenceValue: null,
      });

      return;
    }

    // Reset the state to show that we are loading
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

    // Load the second work if necessary
    const { secondWork } = this.state;
    if (secondWork) {
      this.loadSecondWorkChapter(secondWork, ...divisions);
    }

    fetch(ENDPOINT_READ_WORK(work, ...divisions))
      .then((res) => Promise.all([res.status, res.json()]))
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
            redirectedFrom,
            redirectedTo,
            highlightedVerse: data.verse_to_highlight,
          });

          // Remember that we read this work
          setWorkProgress(work, divisions, data.reference_descriptor);

          // Add the verse to the list
          this.addVerseToHistoryList(
            READ_WORK(work, ...divisions),
            data.chapter.full_descriptor,
            data.verse_to_highlight,
            data.chapter.description
          );

          // Update the URL if we were redirected
          if (redirectedFrom) {
            this.updateHistory(data.work.title_slug, secondWork, ...divisions);
          }
        } else {
          this.setErrorState(
            "Work could not be found",
            "Yikes. The given work is not recognized as a valid work."
          );
        }
      })
      .catch((e) => {
        this.setErrorState(
          "Unable to load the content",
          "The given chapter could not be loaded from the server",
          e.toString()
        );
      });
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  loadSecondWorkChapter(work, ...divisions) {
    // Load the start page if there is no work to load
    if (!work) {
      return;
    }

    // Reset the state to show that we are loading
    this.setState({
      secondWork: work,
      secondWorkData: null,
      secondWorkTitle: null,
    });

    fetch(ENDPOINT_READ_WORK(work, ...divisions))
      .then((res) => Promise.all([res.status, res.json()]))
      .then(([status, data]) => {
        if (status >= 200 && status < 300) {
          this.setState({
            secondWorkData: data,
            secondWork: work,
            secondWorkTitle: data.work.title,
          });

          // Remember that we read this work
          setWorkProgress(work, divisions, data.reference_descriptor);

        } else {
          this.setErrorState(
            "Work could not be found",
            "Yikes. The given work is not recognized as a valid work."
          );
        }
      })
      .catch((e) => {
        this.setErrorState(
          "Unable to load the content",
          "The given chapter could not be loaded from the server",
          e.toString()
        );
      });
  }

  /**
   * Open the about modal.
   */
  openAboutModal() {
    this.setState({ modal: "about" });
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
    this.setState({ modal: "aboutWork" });
  }

  /**
   * Go to the search page.
   */
  openSearch() {
    const { history } = this.props;
    const { divisions, loadedWork, secondWork } = this.state;

    let q = `work:${loadedWork}`;

    // Add the second work
    if (secondWork) {
      q += ` OR work:${secondWork}`;
    }

    // Add in the section
    if (divisions && divisions.length > 0) {
      q += ` section:${divisions[0]}`;
    }

    history.push(SEARCH(q), {
      work: loadedWork,
      secondWork,
      divisions,
    });
  }

  /**
   * Open the modal for downloading a work.
   */
  openDownloadModal() {
    this.setState({ modal: "downloadWork" });
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
   * Go to the reference defined in the input box.
   */
  goToReference(requestedWork, referenceValue, referenceInfo) {

    // Stop if we have no where to go
    if (!requestedWork || !referenceValue) {
      return;
    }

    this.setState({
      divisions: referenceInfo.divisions,
      referenceValue,
    });

    this.navigateToChapter(requestedWork, ...referenceInfo.divisions);
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

  /**
   * Close the second work
   */
  closeSecondWork() {
    const { loadedWork, divisions } = this.state;

    this.setState({
      secondWork: null,
      secondWorkData: null,
    })

    this.updateHistory(loadedWork, null, ...divisions);
  }

  render() {
    const {
      modal,
      data,
      errorDescription,
      loading,
      referenceValue,
      bookSelectionOpen,
      errorTitle,
      errorMessage,
      redirectedFrom,
      sidebarVisible,
      loadedWork,
      highlightedVerse,
      selectedWord,
      popupX,
      popupY,
      popupPositionRight,
      popupPositionBelow,
      selectedNote,
      secondWork,
      secondWorkData,
      secondWorkTitle,
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
    let description = "";
    let referenceDescription = referenceValue;

    if (data) {
      description = data.chapter.description;

      if (referenceValue === "") {
        referenceDescription = description;
      }
    }

    // Create a custom className for signaling the desire to switch to inverted
    let classNameSuffix = "";

    if (inverted) {
      classNameSuffix = " inverted";
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
    const authors =
      data && data.authors ? data.authors.map((author) => author.name) : null;

    return (
      <>
        <ReadingMenuBar
          inverted={inverted}
          relatedWorks={relatedWorks}
          authors={authors}
          loadedWork={loadedWork}
          toggleSidebarVisible={() => this.toggleSidebarVisible()}
          onSelectWork={(work) => this.onSelectWork(work)}
          setBookSelectionOpen={(b) => this.setBookSelectionOpen(b)}
          bookSelectionOpen={bookSelectionOpen}
          goToReference={(newWork, newReferenceValue, referenceInfo) => this.goToReference(newWork, newReferenceValue, referenceInfo)}
          openAboutModal={() => this.openAboutModal()}
          goToPriorChapter={loading ? null : () => this.goToPriorChapter()}
          goToNextChapter={loading ? null : () => this.goToNextChapter()}
          referenceValue={referenceDescription}
          hasNextChapter={!loading && data && data.next_chapter !== null}
          hasPriorChapter={!loading && data && data.previous_chapter !== null}
          nextChapterDescriptor={data && data.previous_chapter && data.previous_chapter.full_descriptor}
          previousChapterDescriptor={data && data.next_chapter && data.next_chapter.full_descriptor}
        />
        {mode === MODE_DONE && (
        <>
          <BookSidebar
            sidebarVisible={sidebarVisible}
            work={loadedWork}
            openWorkInfoModal={() => this.openWorkInfoModal()}
            openDownloadModal={() => this.openDownloadModal()}
            openSearch={() => this.openSearch()}
            setSidebarVisible={() => this.setSidebarVisible()}
          />
          <Sidebar.Pushable
            as={Segment}
            basic
            style={SidebarStyle}
            className={`${classNameSuffix}`}
          >
            <Sidebar.Pusher>
              <Container className={`underMenu ${classNameSuffix}`}>
                {getDialogs(modal, data, loading, loadedWork, () => this.closeModal())}
                {getPopups(modal, data, loading, selectedWord, popupX, popupY, popupPositionRight, popupPositionBelow, selectedNote, loadedWork, () => this.closeModal(), inverted)}
                <Grid inverted={inverted}>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <ChapterHeader inverted={inverted} data={data} onChangeChapter={(event, info) => this.changeChapter(event, info)} />
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Container textAlign="right">
                        <Header inverted={inverted} floated="right" as="h3">
                          {data.work.title}
                          {secondWork && secondWorkTitle && (
                            <>
                              {' / '}
                              {secondWorkTitle}
                              <Icon title={`Close ${secondWorkTitle}`} size='mini' style={{cursor: 'pointer', fontSize: 13, paddingLeft: 8}} inverted={inverted} name='close' onClick={() => this.closeSecondWork()} />
                            </>
                          )}
                        </Header>
                      </Container>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <div style={{ marginTop: 6 }} />
                {data && <WarningMessages warnings={data.warnings} />}
                {redirectedFrom && <StaleURLMessage inverted={inverted} />}
                <BookProgress data={data} />

                {!secondWork && (
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
                )}

                {secondWork && (
                  <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                      <Grid.Column>
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
                      </Grid.Column>
                      <Grid.Column>
                        {secondWorkData && (
                          <Chapter
                            chapter={secondWorkData.chapter}
                            content={secondWorkData.content}
                            work={secondWorkData.work}
                            onVerseClick={(verseDescriptor, verse, id, href) => this.onVerseClickSecondWork(verseDescriptor, verse, id.substr(PARALLEL_WORK_PREFIX.length), href)}
                            onWordClick={(word, x, y, positionRight, positionBelow) => {
                              this.onWordClick(word, x, y, positionRight, positionBelow);
                            }}
                            onNoteClick={onNoteClick}
                            onClickAway={() => this.closeModal()}
                            highlightedVerse={highlightedVerse}
                            inverted={inverted}
                            verseIdentifierPrefix={PARALLEL_WORK_PREFIX}
                          />
                        )}
                        {!secondWorkData && getPlaceholder(inverted)}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                )}
              </Container>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </>
        )}
        {mode === MODE_ERROR && (
          <Container style={ContainerStyle} className={`${classNameSuffix}`}>
            <ErrorMessage inverted={inverted} title={errorTitle} description={errorDescription} message={errorMessage} />
          </Container>
        )}
        {mode === MODE_LOADING && (
          <Container style={ContainerStyle} className={`${classNameSuffix}`}>
            {getPlaceholder(inverted)}
          </Container>
        )}
        {mode === MODE_NOT_READY && (
          <Container style={ContainerStyle} className={`${classNameSuffix}`}>
            <div style={{ paddingTop: 24 }}>
              <NoWorkSelected
                onClick={() => this.setBookSelectionOpen()}
                inverted={inverted}
              />
              <FavoriteWorks inverted={inverted} />
            </div>
          </Container>
        )}
        {modal === "about" && <AboutDialog onClose={() => this.closeModal()} />}
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
