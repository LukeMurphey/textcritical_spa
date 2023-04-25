import React, { useState, useEffect, useRef } from "react";
import { Container, Header, Grid, Segment, Sidebar, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ENDPOINT_READ_WORK, ENDPOINT_WORD_FORMS } from "../Endpoints/urls";
import { setWorkProgress } from "../Settings/worksList";
import { setFontAdjustment, getFontAdjustment, MAX_FONT_SIZE_ADJUSTMENT } from "../Settings/fontAdjustment";
import { SEARCH, READ_WORK } from "../URLs";
import { PARAMS_READ_WORK } from "../URLs/Parameters";
import { getPlaceholder, getDialogs }  from "./shortcuts";
import { scrollToTarget } from '../Utils';
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
import Popups, { MODAL_WORD, MODAL_FOOTNOTE, MODAL_CONTEXT } from "./Popups";
import { MODE_LOADING, MODE_ERROR, MODE_DONE, MODE_NOT_READY } from "../Constants";
import { GlobalAppContext } from "../GlobalAppContext";

/**
 * Below are some notes about how this works:
 *   * useState() will trigger the fetch of the work as necessary when the URL changes.
 *   * loadChapter() will fetch the chapter and load it into the UI.
 */
const PARALLEL_WORK_PREFIX = 'secondWork-';

const ContainerStyle = {
  paddingTop: 0,
};

const SidebarStyle = {
  height: "calc(100vh - 60px)",
  marginTop: 0,
};

const getWordFormsDebounced = AwesomeDebouncePromise(
  (word) =>
  fetch(ENDPOINT_WORD_FORMS(word)),
  500
);

/**
 * Scroll to the given verse
 *
 * @param {string} verse The number of the verse to scroll to.
 */
const scrollToVerse = (verse) => {
  // Scroll to the verse
  if(verse) {
    scrollToTarget(`verse-link_${verse}`);
  }
}

/**
 * Get the parameter of the second work to be loaded.
 */
const getSecondWorkParameter = (location) => {
  const params = new URLSearchParams(location.search);
  return params.get('parallel');
}

/**
 * Go to the search page.
 */
const openSearch = (loadedWork, secondWork, divisions, history) => {
  let q = `work:${loadedWork}`;

  // Add the second work
  if (secondWork) {
    q += ` OR work:${secondWork}`;
  }

  // Add in the section
  if (divisions && divisions.length > 0) {
    q += ` section:"${divisions[0]}"`;
  }

  history.push(SEARCH(q), {
    work: loadedWork,
    secondWork,
    divisions,
  });
}

const Reader = ({
  inverted,
  location,
  history,
  match,
  highlightRelatedForms
}) => {

  const [modal, setModal] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [divisions, setDivisions] = useState(null);
  const [referenceValue, setReferenceValue] = useState(null);
  const [loadedWork, setLoadedWork] = useState(null);

  const [bookSelectionOpen, setBookSelectionOpen] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [errorDescription, setErrorDescription] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [redirectedFrom, setRedirectedFrom] = useState(null);
  const [redirectedTo, setRedirectedTo] = useState(null);

  const [highlightedVerse, setHighlightedVerse] = useState(null);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  const [popupX, setPopupX] = useState(null);
  const [popupY, setPopupY] = useState(null);
  const [popupPositionRight, setPopupPositionRight] = useState(null);
  const [popupPositionBelow, setPopupPositionBelow] = useState(null);
  const [popupWork, setPopupWork] = useState(null);

  const [selectedNote, setSelectedNote] = useState(null);

  const [secondWork, setSecondWork] = useState(null);
  const [secondWorkData, setSecondWorkData] = useState(null);
  const [secondWorkChapterNotFound, setSecondWorkChapterNotFound] = useState(false);
  const [secondWorkTitle, setSecondWorkTitle] = useState(null);

  const [fontSizeAdjustment, setFontSizeAdjustment] = useState(getFontAdjustment());

  // Keep a list of verse references that are known to be a reference within the current chapter
  const verseReferences = useRef([]);
  const popupContextData = useRef(null);

  const { authentication, storageProvider } = React.useContext(GlobalAppContext);

  /**
   * Set an error state.
   *
   * @param {string} errorTitle The title
   * @param {string} errorDescription The description
   * @param {string} errorMessage The detailed error message (like from an AJAX call)
   */
  const setErrorState = (errTitle, errDescription = "", errMessage = null) => {
    setErrorMessage(errMessage);
    setErrorDescription(errDescription);
    setErrorTitle(errTitle);
  }

  /**
   * Increase the font size
   */
  const increaseFontSize = () => {
    if(fontSizeAdjustment < MAX_FONT_SIZE_ADJUSTMENT) {
      setFontAdjustment(fontSizeAdjustment + 1);
      setFontSizeAdjustment(fontSizeAdjustment + 1);
    }
  }

  /**
   * Decrease the font size
   */
  const decreaseFontSize = () => {
    if(fontSizeAdjustment > 0) {
      setFontAdjustment(fontSizeAdjustment - 1);
      setFontSizeAdjustment(fontSizeAdjustment - 1);
    }
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  const loadSecondWorkChapter = (work, ...secondDivisions) => {
    // Load the start page if there is no work to load
    if (!work) {
      return;
    }

    // Reset the state to show that we are loading
    setSecondWork(work);
    setSecondWorkData(null);
    setSecondWorkTitle(null);

    fetch(ENDPOINT_READ_WORK(work, ...secondDivisions))
      .then((res) => Promise.all([res.status, res.json()]))
      .then(([status, newData]) => {
        if (status >= 200 && status < 300) {
          setSecondWork(work);
          setSecondWorkData(newData);
          setSecondWorkTitle(newData.work.title);

          if(status === 210) {
            setSecondWorkChapterNotFound(true);
          } else {
            setSecondWorkChapterNotFound(false);
          }

          // Rescroll to keep the verse in the view
          if(highlightedVerse) {
            scrollToVerse(highlightedVerse);
          }

          // Remember that we read this work
          setWorkProgress(work, secondDivisions, newData.reference_descriptor, storageProvider);

        } else {
          setErrorState(
            "Work could not be found",
            "Yikes. The given work is not recognized as a valid work."
          );
        }
      })
      .catch((e) => {
        setErrorState(
          "Unable to load the content",
          "The given chapter could not be loaded from the server",
          e.toString()
        );
      });
  }

  /**
   * Update the history but only if it has changed.
   *
   * @param {str} work The title slug of the work
   * @param {str} secondWork The title slug of the second work to load work
   * @param  {...any} divisions The list of division indicators
   */
  const updateHistory = (work, newSecondWork, ...newDivisions) => {

    const parallelWork = getSecondWorkParameter(location);

    // Get the URL
    const workUrl = READ_WORK(work, null, ...newDivisions);

    // Determine if the URL is already set
    // Note that we need to check redirectedFrom because the URL might not match because we were
    // redirected since a work had been renamed.
    if (workUrl === location.pathname && parallelWork === newSecondWork) {
      return false;
    }

    // Add the parallel work
    if (newSecondWork) {
      history.push({
        pathname: workUrl,
        search: PARAMS_READ_WORK(newSecondWork)
      })
    } else {
      history.push(workUrl);
    }

    return true;
  }

  /**
   * Go to the reference defined in the input box.
   */
  const goToReference = (requestedWork, newReferenceValue, referenceInfo) => {

    // Stop if we have no where to go
    if (!requestedWork || !referenceValue) {
      return;
    }

    setDivisions(referenceInfo.divisions);
    scrollToVerse(referenceInfo.verse_to_highlight);
    setHighlightedVerse(referenceInfo.verse_to_highlight);
    setReferenceValue(newReferenceValue);

    // TODO: find a way to keep the verse to highlight 
    updateHistory(requestedWork, secondWork, ...referenceInfo.divisions);
  }

  /**
   * Close the second work
   */
  const closeSecondWork = () => {
    setSecondWork(null);
    setSecondWorkData(null);

    if(divisions) {
      updateHistory(loadedWork, null, ...divisions);
    }
    else {
      updateHistory(loadedWork);
    }
  }

  /**
   * Handle the selection of a work.
   * @param {string} work the title slug of a work to load
   */
  const onSelectWork = (work) => {
    let isRelated = false;

    // See if this is a related work
    if (data && data.related_works) {
      isRelated = data.related_works.find(
        (relatedWork) => relatedWork.title_slug === work
      );
    }

    // If this is related work, then use the same divisions
    if (isRelated && work !== loadedWork) {
      setBookSelectionOpen(false);
      loadSecondWorkChapter(work, ...divisions);

      history.push({
        pathname: location.pathname,
        search: PARAMS_READ_WORK(work)
      })
    } else {
      // Drop the second work since this one is not related
      closeSecondWork();
      updateHistory(work);  
    }
  }

  /**
   * Add the href to the list so that we can remember what URL is capable of loading it.
   * @param {string} href The partial URL of the page (e.g. "/work/new-testament/John/8/4")
   * @param {string} chapter The chapter descriptor (e.g. "John/9")
   */
  const addVerseToHistoryList = (href, chapter, verse, newReferenceValue) => {
    verseReferences.current[href] = {
      chapter,
      verse,
      newReferenceValue,
    };
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {string} verseDescriptor A description of the verse (e.g. "John 8:4")
   * @param {string} verse The verse number (e.g. "4")
   * @param {string} id An ID that designates the verse in the HTML DOM
   * @param {string} href A href for the verse (e.g. "/work/new-testament/John/8/4")
   */
  const onVerseClick = (verseDescriptor, verse, id, href) => {
    // Add the verse to the list
    addVerseToHistoryList(
      href,
      data.chapter.full_descriptor,
      verse,
      verseDescriptor
    );

    scrollToTarget(id);

    setReferenceValue(verseDescriptor);
    
    // Add the parallel work
    if (secondWork) {
      history.push(`${href}${PARAMS_READ_WORK(secondWork)}`);
    } else {
      history.push(href);
    }
  }

  /**
   * Handle the clicking of a verse of a second work.
   *
   * @param {string} verseDescriptor A description of the verse (e.g. "John 8:4")
   * @param {string} verse The verse number (e.g. "4")
   * @param {string} id An ID that designates the verse in the HTML DOM
   */
  const onVerseClickSecondWork = (verseDescriptor, verse, id) => {
    const firstWorkId = id.substr(PARALLEL_WORK_PREFIX.length);

    // Find the verse descriptor from the first work
    const firstWorkVerse = document.getElementById(firstWorkId);

    // Fire the associated handler
    // This may not match for works that have more verses in the parallel work than the primary one
    if(firstWorkVerse) {
      onVerseClick(verseDescriptor, verse, id, firstWorkVerse.attributes.href.value);
    }
  }

  /**
   * Go to the next chapter.
   */
  const goToNextChapter = () => {
    if (data && data.next_chapter) {
      updateHistory(loadedWork, secondWork, data.next_chapter.full_descriptor);
    }
  }

  /**
   * Go to the prior chapter.
   */
  const goToPriorChapter = () => {
    if (data && data.previous_chapter) {
      updateHistory(loadedWork, secondWork, data.previous_chapter.full_descriptor);
    }
  }

  /**
   * Handle the selection of the division.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  const changeChapter = (event, info) => {
    updateHistory(loadedWork, secondWork, info.value);
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {string} word The word to get information on
   * @param {int} x The x coordinate designating where to show the popup
   * @param {int} y The y coordinate designating where to show the popup
   * @param {bool} positionRight Indicates it is best to show the popup to the right of the offset
   * @param {bool} positionBelow Indicates it is best to show the popup below the offset
   * @param {string} work Indicates the work clicked
   */
  const onWordClick = (word, x, y, positionRight, positionBelow, work) => {
    setSelectedWord(word);
    setPopupX(x);
    setPopupY(y);
    setPopupPositionRight(positionRight);
    setPopupPositionBelow(positionBelow);
    setPopupWork(work);
    setModal(MODAL_WORD);

    if(highlightRelatedForms) {
      getWordFormsDebounced(word)
      .then((res) => res.json())
      .then(wordData => {
        if(wordData.forms.length > 1){
          // Add in the word we searched for just in case
          const wordsList = wordData.forms.slice();
          wordsList.splice(0, 0, word);

          // Light them up
          setHighlightedWords(wordsList);
        }
        
      });
    }
  }

  /**
   * Handle the context menu.
   *
   * @param {int} x The x coordinate designating where to show the popup
   * @param {int} y The y coordinate designating where to show the popup
   * @param {bool} positionRight Indicates it is best to show the popup to the right of the offset
   * @param {bool} positionBelow Indicates it is best to show the popup below the offset
   * @param {string} work Indicates the work clicked
   */
   const onContextClick = (x, y, positionRight, positionBelow, work, content, contextType, contextData, event) => {
    setSelectedWord(null);
    setPopupX(x);
    setPopupY(y);
    setPopupPositionRight(positionRight);
    setPopupPositionBelow(positionBelow);
    setPopupWork(work);
    popupContextData.current = { content, contextType, contextData, event }
    setModal(MODAL_CONTEXT);
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
  const onNoteClick = (note, id, x, y, positionRight, positionBelow) => {
    setSelectedNote(note);
    setPopupX(x);
    setPopupY(y);
    setPopupPositionRight(positionRight);
    setPopupPositionBelow(positionBelow);
    setModal(MODAL_FOOTNOTE);
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The title slug of the work
   * @param {array} divisions The list of division indicators
   */
  const loadChapter = (work, ...newDivisions) => {
    // Load the start page if there is no work to load
    if (!work) {
      setBookSelectionOpen(false);
      setModal(null);
      setErrorTitle(null);
      setErrorMessage(null);
      setErrorDescription(null);
      setRedirectedFrom(null);
      setRedirectedTo(null);
      setHighlightedVerse(null);
      setData(null);
      setLoading(null);
      setLoadedWork(null);
      setDivisions(null);
      setReferenceValue(null);

      return;
    }

    // Reset the state to show that we are loading
    setLoading(true);
    setBookSelectionOpen(false);
    setModal(null);
    setErrorTitle(null);
    setErrorMessage(null);
    setErrorDescription(null);
    setRedirectedFrom(null);
    setRedirectedTo(null);
    setHighlightedVerse(null);

    // Load the second work if necessary
    if (secondWork) {
      loadSecondWorkChapter(secondWork, ...newDivisions);
    }

    // Load the work
    fetch(ENDPOINT_READ_WORK(work, ...newDivisions))
      .then((res) => Promise.all([res.status, res.json()]))
      .then(([status, updatedData]) => {
        if (status >= 200 && status < 300) {
          let newRedirectedFrom = null;
          let newRedirectedTo = null;

          // If the work alias didn't match, then update the URL accordingly
          if (updatedData.work.title_slug !== work) {
            newRedirectedFrom = READ_WORK(work, null, ...newDivisions);
            newRedirectedTo = READ_WORK(updatedData.work.title_slug, null, ...newDivisions);
          }

          setLoadedWork(updatedData.work.title_slug);
          setDivisions(newDivisions);
          setReferenceValue(updatedData.reference_descriptor);
          setRedirectedFrom(newRedirectedFrom);
          setRedirectedTo(newRedirectedTo);
          setHighlightedVerse(updatedData.verse_to_highlight);
          setData(updatedData);
          setLoading(false);

          // Remember that we read this work
          setWorkProgress(work, newDivisions, updatedData.reference_descriptor, storageProvider);

          // Add the verse to the list
          addVerseToHistoryList(
            READ_WORK(work, null, ...newDivisions),
            updatedData.chapter.full_descriptor,
            updatedData.verse_to_highlight,
            updatedData.chapter.description
          );

          // Scroll to the verse
          scrollToVerse(updatedData.verse_to_highlight);

          // Update the URL if we were redirected
          if (redirectedFrom) {
            updateHistory(updatedData.work.title_slug, secondWork, ...newDivisions);
          }
        } else {
          setErrorState(
            "Work could not be found",
            "Yikes. The given work is not recognized as a valid work."
          );
        }
      })
      .catch((e) => {
        setErrorState(
          "Unable to load the content",
          "The given chapter could not be loaded from the server",
          e.toString()
        );
      });
  }

  const previousPathname = useRef();

  useEffect(() => {
    // Get the divisions from the URL
    const divisionsFiltered = [
      match.params.division0,
      match.params.division1,
      match.params.division2,
      match.params.division3,
      match.params.division4,
      match.params.leftovers,
    ].filter((entry) => entry);

    // See if we have loaded the same work
    const sameSecondWork = secondWork === getSecondWorkParameter(location);

    // See if we know that this is a reference to this chapter
    const existingChapter = verseReferences.current[location.pathname];

    // Check if the chapter we have loaded already
    // This needs to check the loaded work too, since we need to recognize if we the reference is
    // the same reference but in a different work.
    let isReferenceForSameChapter = false;
    if(data && existingChapter && loadedWork) {
      if(existingChapter.chapter === data.chapter.full_descriptor && loadedWork === match.params.work) {
        isReferenceForSameChapter = true;
      }
    }
  
    // Check if the chapter we have loaded already
    // This needs to check the loaded work too, since we need to recognize if we the reference is
    // the same reference but in a different work.
    if (isReferenceForSameChapter && sameSecondWork) {
  
      // Get the highlighted verse
      const highlightedVerseRef = existingChapter.verse;

      if (highlightedVerse !== highlightedVerseRef) {
        if(highlightedVerseRef) {
          setHighlightedVerse(highlightedVerseRef);
        }
        
        if(!referenceValue){
          setReferenceValue(existingChapter.referenceValue);
        }
      }

      // Don't load the new one, we already have it on the page
      return;
    }

    // Determine if the page changed
    if (
      (location.pathname !== previousPathname.current &&
      redirectedTo !== location.pathname)
    ) {
      loadChapter(match.params.work, ...divisionsFiltered);
      previousPathname.current = location.pathname;
      return;
    }

    previousPathname.current = location.pathname;

    // Try to get the second work
    if (!sameSecondWork) {
      if(getSecondWorkParameter(location)) {
        loadSecondWorkChapter(getSecondWorkParameter(location), ...divisionsFiltered);
      }
      else {
        setSecondWork(null);
        setSecondWorkData(null);
      }
    }
  });

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
  } else if (match.params && match.params.work && !data) {
    mode = MODE_LOADING;
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
      <div
        className="buffer"
        style={{
          height: 54,
          width: "100%",
        }}
      />
      <ReadingMenuBar
        inverted={inverted}
        relatedWorks={relatedWorks}
        authors={authors}
        loadedWork={loadedWork}
        toggleSidebarVisible={() => setSidebarVisible(!sidebarVisible)}
        onSelectWork={(work) => onSelectWork(work)}
        setBookSelectionOpen={(b) => setBookSelectionOpen(b)}
        bookSelectionOpen={bookSelectionOpen}
        goToReference={(newWork, newReferenceValue, referenceInfo) =>
          goToReference(newWork, newReferenceValue, referenceInfo)}
        openAboutModal={() => setModal("about")}
        openLoginModal={() => setModal("login")}
        goToPriorChapter={loading ? null : () => goToPriorChapter()}
        goToNextChapter={loading ? null : () => goToNextChapter()}
        referenceValue={referenceDescription}
        hasNextChapter={!loading && data && data.next_chapter !== null}
        hasPriorChapter={!loading && data && data.previous_chapter !== null}
        nextChapterDescriptor={
          data && data.previous_chapter && data.previous_chapter.full_descriptor
        }
        previousChapterDescriptor={
          data && data.next_chapter && data.next_chapter.full_descriptor
        }
        decreaseFontSize={!loading && data ? () => decreaseFontSize() : null}
        increaseFontSize={!loading && data ? () => increaseFontSize() : null}
        increaseFontSizeDisabled={
          fontSizeAdjustment >= MAX_FONT_SIZE_ADJUSTMENT
        }
        decreaseFontSizeDisabled={fontSizeAdjustment <= 0}
        storageProvider={storageProvider}
      />
      {mode === MODE_DONE && (
        <>
          <BookSidebar
            sidebarVisible={sidebarVisible}
            work={loadedWork}
            openWorkInfoModal={() => setModal("aboutWork")}
            openDownloadModal={() => setModal("downloadWork")}
            openSearch={() =>
              openSearch(loadedWork, secondWork, divisions, history)}
            setSidebarVisible={() => setSidebarVisible()}
          />
          <Sidebar.Pushable
            as={Segment}
            basic
            style={SidebarStyle}
            className={`${classNameSuffix}`}
          >
            <Sidebar.Pusher>
              <Container className={`underMenu ${classNameSuffix}`}>
                {getDialogs(modal, data, loading, loadedWork, () =>
                  setModal(null)
                )}
                { modal && (
                  <Popups
                    modal={modal} 
                    data={data}
                    loading={loading}
                    selectedWord={selectedWord}
                    popupX={popupX}
                    popupY={popupY}
                    popupPositionRight={popupPositionRight}
                    popupPositionBelow={popupPositionBelow}
                    selectedNote={selectedNote}
                    popupWork={popupWork}
                    closeModal={() => setModal(null)}
                    searchState={{
                      work: loadedWork,
                      secondWork,
                      divisions,
                    }}
                    inverted={inverted}
                    popupContextData={popupContextData.current}
                  />
                ) }
                <Grid inverted={inverted}>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <ChapterHeader
                        inverted={inverted}
                        data={data}
                        onChangeChapter={(event, info) => changeChapter(event, info)}
                      />
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Container textAlign="right">
                        <Header inverted={inverted} floated="right" as="h3">
                          {data.work.title}
                          {secondWork && secondWorkTitle && (
                            <>
                              {" / "}
                              {secondWorkTitle}
                              <Icon
                                title={`Close ${secondWorkTitle}`}
                                size="mini"
                                style={{
                                  cursor: "pointer",
                                  fontSize: 13,
                                  paddingLeft: 8,
                                }}
                                inverted={inverted}
                                name="close"
                                onClick={() => closeSecondWork()}
                              />
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
                    onWordClick={(word, x, y, positionRight, positionBelow) => {
                      onWordClick(
                        word,
                        x,
                        y,
                        positionRight,
                        positionBelow,
                        loadedWork
                      );
                    }}
                    onNoteClick={onNoteClick}
                    onContextClick={(x, y, positionRight, positionBelow, content, contextType, contextData, event) => {
                      onContextClick(x, y, positionRight, positionBelow, data.work, content, contextType, contextData, event);
                    }}
                    onClickAway={() => setModal(null)}
                    highlightedVerse={highlightedVerse}
                    inverted={inverted}
                    fontSizeAdjustment={fontSizeAdjustment}
                    highlightedWords={highlightedWords}
                  />
                )}

                {secondWork && (
                  <Grid divided="vertically">
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <Chapter
                          chapter={data.chapter}
                          content={data.content}
                          work={data.work}
                          onVerseClick={onVerseClick}
                          onWordClick={(
                            word,
                            x,
                            y,
                            positionRight,
                            positionBelow
                          ) => {
                            onWordClick(
                              word,
                              x,
                              y,
                              positionRight,
                              positionBelow,
                              loadedWork
                            );
                          }}
                          onNoteClick={onNoteClick}
                          onContextClick={(x, y, positionRight, positionBelow) => {
                            onContextClick(
                              data,
                              x,
                              y,
                              positionRight,
                              positionBelow,
                            );
                          }}
                          onClickAway={() => setModal(null)}
                          highlightedVerse={highlightedVerse}
                          inverted={inverted}
                          fontSizeAdjustment={fontSizeAdjustment}
                          highlightedWords={highlightedWords}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        {secondWorkData && !secondWorkChapterNotFound && (
                          <Chapter
                            chapter={secondWorkData.chapter}
                            content={secondWorkData.content}
                            work={secondWorkData.work}
                            onVerseClick={(verseDescriptor, verse, id, href) =>
                              onVerseClickSecondWork(
                                verseDescriptor,
                                verse,
                                id,
                                href
                              )}
                            onWordClick={(
                              word,
                              x,
                              y,
                              positionRight,
                              positionBelow
                            ) => {
                              onWordClick(
                                word,
                                x,
                                y,
                                positionRight,
                                positionBelow,
                                secondWork
                              );
                            }}
                            onNoteClick={onNoteClick}
                            onContextClick={(x, y, positionRight, positionBelow) => {
                              onContextClick(
                                data,
                                x,
                                y,
                                positionRight,
                                positionBelow,
                              );
                            }}
                            onClickAway={() => setModal(null)}
                            highlightedVerse={highlightedVerse}
                            inverted={inverted}
                            verseIdentifierPrefix={PARALLEL_WORK_PREFIX}
                            fontSizeAdjustment={fontSizeAdjustment}
                            highlightedWords={highlightedWords}
                          />
                        )}
                        {secondWorkData && secondWorkChapterNotFound && (
                          <WarningMessages
                            inverted={inverted}
                            warnings={[
                              [
                                "Chapter not found",
                                `The given chapter does not exist in ${secondWorkTitle}`,
                              ],
                            ]}
                          />
                        )}
                        {!secondWorkData &&
                          !secondWorkChapterNotFound &&
                          getPlaceholder(inverted)}
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
          <ErrorMessage
            inverted={inverted}
            title={errorTitle}
            description={errorDescription}
            message={errorMessage}
          />
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
              onClick={() => setBookSelectionOpen(true)}
              inverted={inverted}
            />
            {authentication.authLoadingDone && <FavoriteWorks inverted={inverted} storageProvider={storageProvider} /> }
          </div>
        </Container>
      )}
      {modal === "about" && <AboutDialog onClose={() => setModal(null)} />}
    </>
  );

}

Reader.propTypes = {
  inverted: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
  highlightRelatedForms: PropTypes.bool,
};

Reader.defaultProps = {
  inverted: false,
  highlightRelatedForms: false,
};

export default withRouter(Reader);