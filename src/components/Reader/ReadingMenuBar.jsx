import React, { useState, useEffect, useRef } from 'react';
import { Menu, Container, Icon, Popup, Input, Button, Responsive, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { START_PAGE, BETA_CODE_CONVERT, SEARCH } from "../URLs";
import LibraryIcon from "../Icons/Library.svg";
import BookSelection from '../BookSelection';
import { addHandler, removeHandler } from '../Utils';
import {
  ENDPOINT_RESOLVE_REFERENCE,
  ENDPOINT_READ_WORK
} from "../Endpoints";

const NextPageStyle = {
  bottom: "20px",
  right: "20px",
  position: "fixed",
};

const PriorPageStyle = {
  bottom: "20px",
  left: "20px",
  position: "fixed",
};

const resolveReferenceDebounced = AwesomeDebouncePromise(
  (titleSlug, reference) =>
    fetch(ENDPOINT_RESOLVE_REFERENCE(titleSlug, reference)),
  500
);

const ReadingMenuBar = ({
  inverted,
  toggleSidebarVisible,
  loadedWork,
  relatedWorks,
  authors,
  onSelectWork,
  setBookSelectionOpen,
  bookSelectionOpen,
  goToReference,
  openAboutModal,
  referenceValue,
  history,
  hasPriorChapter,
  hasNextChapter,
  goToPriorChapter,
  goToNextChapter,
  nextChapterDescriptor,
  previousChapterDescriptor,
  increaseFontSize,
  decreaseFontSize,
  increaseFontSizeDisabled,
  decreaseFontSizeDisabled,
 }) => {
  // Create a custom className for signaling the desire to switch to inverted
  let classNameSuffix = "";

  if (inverted) {
    classNameSuffix = " inverted";
  }

  // The temp reference value represents the local value of the reference that has not yet been
  // sent up to the caller.
  const [ tempReferenceValue, setTempReferenceValue ] = useState(null);

  // Indicates if the reference is valid
  const [ referenceValid, setReferenceValid ] = useState(true);

  // Indicates we got an error somewhere
  const [ error, setError ] = useState(null);

  // This will store the last reference set so that we make sure not to replace the reference
  // we did a reference resolution check against the server for.
  const lastSetReference = useRef(null);
  
  /**
   * Go to the reference defined in the input box but only if it is valid.
   */
  const checkAndGoToReference = (requestedWork, requestedReferenceValue) => {
    // Stop if we have no where to go
    if (!requestedWork || !requestedReferenceValue) {
      return;
    }

    // Verify the reference is valid before going to it
    fetch(ENDPOINT_RESOLVE_REFERENCE(requestedWork, requestedReferenceValue))
      .then((res) => Promise.all([res.status, res.json()]))
      .then(([status, referenceInfo]) => {
        if (status === 200) {
          goToReference(requestedWork, requestedReferenceValue, referenceInfo);
        }
      })
  }

    /**
     * Accept the enter key as a jumop to execute the reference jump.
     * @param {object} event The event from the key press.
     */
    const onKeyPressed = (event) => {
      if (event.key === "Enter") {
        setTempReferenceValue(null);
        checkAndGoToReference(loadedWork, tempReferenceValue || referenceValue);
      }
    }

    /**
     * Handle a change in the reference input.
     *
     * @param {*} event React's original SyntheticEvent.
     * @param {*} info All props.
     */
    const changeReference = (event, info) => {
      // Stop if we have nothing to lookup
      if (!loadedWork || !info.value) {
        return;
      }

      setTempReferenceValue(info.value);
      setReferenceValid(true);
      setError(null);

      // Store this entry so that we can avoid updating the reference if the user entered another
      // reference before the server's response came back
      lastSetReference.current = info.value;

      resolveReferenceDebounced(loadedWork, info.value)
        .then((res)  => {
          // If the user already changed the value again, just ignore it
          if (lastSetReference.current !== info.value) {
            return;
          }

          if (res.status === 200) {
            setTempReferenceValue(info.value);
            setReferenceValid(true);
          } else {
            setTempReferenceValue(info.value);
            setReferenceValid(false);
          }
        })
        .catch((e) => {
          setError(e.toString());
        });
    }

  /**
   * Preload the next chapter.
   */
  const preloadNextChapter = () => {
    if (nextChapterDescriptor) {
      fetch(
        ENDPOINT_READ_WORK(`${loadedWork}/${nextChapterDescriptor}`)
      );
    }
  }

  /**
   * Preload the prior chapter.
   */
  const preloadPriorChapter = () => {
    if (previousChapterDescriptor) {
      fetch(
        ENDPOINT_READ_WORK(
          `${loadedWork}/${previousChapterDescriptor}`
        )
      );
    }
  }

    /**
     * Preload the next and prior chapter
     */
    const preloadChapters = () => {
      preloadNextChapter();
      preloadPriorChapter();
    }

    /**
     * Open the start page.
     */
    const openStartPage = () => {
      history.push(START_PAGE());
    }

    /**
     * Increase font size.
     */
    const clickIncreaseFontSize = () => {
      if(increaseFontSize){
        increaseFontSize();
      }
    }

    /**
     * Decrease font size.
     */
    const clickDecreaseFontSize = () => {
      if(decreaseFontSize){
        decreaseFontSize();
      }
    }

    /**
     * Open the beta-code conversion page.
     */
    const openBetaCodePage = () => {
      history.push(BETA_CODE_CONVERT());
    }

    /**
     * Open the search page.
     */
    const openSearchPage = () => {
      history.push(SEARCH());
    }

    /**
     * Clear the overriding reference value when the caller changes it.
     * This is necessary when the caller has changed to another page and we need to show the we
     * navigated.
     */
    useEffect(() => {
      setTempReferenceValue(null);
      preloadChapters();
    }, [referenceValue]);
    
    /**
     * Handle key presses
     */
    const upHandler = ({ key, shiftKey }) => {
      if (key === 'ArrowRight' && shiftKey) {
        if(goToNextChapter) {
          goToNextChapter();
        }
      }
  
      if (key === 'ArrowLeft' && shiftKey) {
        if(goToPriorChapter) {
          goToPriorChapter();
        }
      }
    };

    // Wire-up the handlers
    const handler = (event) => upHandler(event);
    useEffect(() => {
      addHandler(handler, 'keyup');
      return () => removeHandler(handler, 'keyup');
    });

    return (
      <Menu
        inverted={inverted}
        style={{ zIndex: 103 }}
        className={`control ${classNameSuffix}`}
        fixed="top"
      >
        <Container>
          {loadedWork && (
          <Menu.Item
            name="works"
            onClick={() => toggleSidebarVisible()}
          >
            <Icon name="bars" />
          </Menu.Item>
        )}
          <Popup
            content={(
              <BookSelection
                relatedWorks={relatedWorks}
                authors={authors}
                onSelectWork={(work) => onSelectWork(work)}
                loadedWork={loadedWork}
              />
          )}
            on="click"
            position="bottom left"
            pinned
            onClose={() => setBookSelectionOpen(false)}
            onOpen={() => setBookSelectionOpen(true)}
            open={bookSelectionOpen}
            trigger={(
              <Menu.Item name="Library">
                <img style={{ width: 16 }} src={LibraryIcon} alt="Library" />
              </Menu.Item>
          )}
          />
          {loadedWork && (
          <Menu.Item>
            <Input
              inverted={inverted}
              className="referenceJumpInput"
              action={(
                <Button
                  disabled={!referenceValid}
                  inverted={inverted}
                  onClick={() => {
                    setTempReferenceValue(null);
                    checkAndGoToReference(loadedWork, tempReferenceValue || referenceValue);
                  }}
                  basic
                >
                  Go
                </Button>
              )}
              placeholder="Jump to reference..."
              value={tempReferenceValue || referenceValue || ''}
              error={!referenceValid}
              onChange={(e, d) => changeReference(e, d)}
              onKeyPress={(e, d) => onKeyPressed(e, d)}
            />
            {error && (<Popup inverted={inverted} content={error} trigger={<Icon style={{paddingLeft: 8}} color="red" name="warning sign" />} />)}
          </Menu.Item>
        )}
          <div style={{ float: "right", marginLeft: "auto", marginTop: 11 }}>
            <Responsive minWidth={768}>
              <Dropdown icon="ellipsis vertical" direction="left">
                <Dropdown.Menu>
                  <Dropdown.Item
                    text="Increase font size"
                    disabled={increaseFontSizeDisabled}
                    onClick={() => clickIncreaseFontSize()}
                  />
                  <Dropdown.Item
                    text="Decrease font size"
                    disabled={decreaseFontSizeDisabled}
                    onClick={() => clickDecreaseFontSize()}
                  />
                  <Dropdown.Item
                    text="Go to Start Page"
                    onClick={() => openStartPage()}
                  />
                  <Dropdown.Item
                    text="Search"
                    onClick={() => openSearchPage()}
                  />
                  <Dropdown.Item
                    text="Look up words (and convert beta-code)"
                    onClick={() => openBetaCodePage()}
                  />
                  <Dropdown.Item
                    text="About TextCritical.net"
                    onClick={() => openAboutModal()}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Responsive>
          </div>
        </Container>
        {loadedWork && goToPriorChapter && goToNextChapter && (
        <>
          <Button
            icon
            inverted={inverted}
            style={PriorPageStyle}
            className={`priorPage ${classNameSuffix}`}
            disabled={!hasPriorChapter}
            onClick={() => goToPriorChapter()}
            title="Go to prior chapter (or use shortcut shift + left arrow)"
          >
            <Icon name="left chevron" />
          </Button>
          <Button
            icon
            inverted={inverted}
            style={NextPageStyle}
            className={`nextPage ${classNameSuffix}`}
            disabled={!hasNextChapter}
            onClick={() => goToNextChapter()}
            title="Go to next chapter (or use shortcut shift + right arrow)"
          >
            <Icon name="right chevron" />
          </Button>
        </>
      )}
      </Menu>
    )
};

ReadingMenuBar.propTypes = {
  inverted: PropTypes.bool.isRequired,
  relatedWorks: PropTypes.arrayOf(PropTypes.shape),
  authors: PropTypes.arrayOf(PropTypes.string),
  loadedWork: PropTypes.string,
  toggleSidebarVisible: PropTypes.func.isRequired,
  onSelectWork: PropTypes.func.isRequired,
  setBookSelectionOpen: PropTypes.func.isRequired,
  bookSelectionOpen: PropTypes.bool,
  goToReference: PropTypes.func.isRequired,
  openAboutModal: PropTypes.func.isRequired,
  goToPriorChapter: PropTypes.func,
  goToNextChapter: PropTypes.func,
  increaseFontSize: PropTypes.func,
  decreaseFontSize: PropTypes.func,
  referenceValue: PropTypes.string,
  hasNextChapter: PropTypes.bool,
  hasPriorChapter: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  nextChapterDescriptor: PropTypes.string,
  previousChapterDescriptor: PropTypes.string,
  increaseFontSizeDisabled: PropTypes.bool,
  decreaseFontSizeDisabled: PropTypes.bool,
}

ReadingMenuBar.defaultProps = {
  referenceValue: '',
  authors: [],
  relatedWorks: [],
  loadedWork: null,
  bookSelectionOpen: false,
  hasNextChapter: false,
  hasPriorChapter: false,
  goToPriorChapter: null,
  goToNextChapter: null,
  increaseFontSize: null,
  decreaseFontSize: null,
  nextChapterDescriptor: null,
  previousChapterDescriptor: null,
  increaseFontSizeDisabled: true,
  decreaseFontSizeDisabled: true,
}

export default withRouter(ReadingMenuBar);
