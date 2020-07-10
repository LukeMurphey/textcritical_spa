import React, { useState, useEffect } from 'react';
import { Menu, Container, Icon, Popup, Input, Button, Responsive, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { START_PAGE, BETA_CODE_CONVERT } from "../URLs";
import LibraryIcon from "../Icons/Library.svg";
import BookSelection from '../BookSelection';
import {
  ENDPOINT_RESOLVE_REFERENCE,
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

let lastSetReference = null;

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
  
    /**
     * Accept the enter key as a jumop to execute the reference jump.
     * @param {object} event The event from the key press.
     */
    const onKeyPressed = (event) => {
      if (event.key === "Enter") {
        setTempReferenceValue(null);
        goToReference(loadedWork, tempReferenceValue || referenceValue);
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

      // Store this entry so that we can avoid updating the reference if the user entered another
      // reference before the server's response came back
      lastSetReference = info.value;

      resolveReferenceDebounced(loadedWork, info.value)
        .then((res)  => {
          // If the user already changed the value again, just ignore it
          if (lastSetReference !== info.value) {
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
          console.log(e.toString());
          /*
          this.setErrorState(
            "Unable to load the content",
            "The given chapter could not be loaded from the server",
            e.toString()
          );
          */
        });
    }

    /**
     * Open the start page.
     */
    const openStartPage = () => {
      history.push(START_PAGE());
    }

    /**
     * Open the beta-code conversion page.
     */
    const openBetaCodePage = () => {
      history.push(BETA_CODE_CONVERT());
    }

    /**
     * Clear the overriding reference value when the caller changes it.
     * This is necessary when the caller has changed to another page and we need to show the we
     * navigated.
     */
    useEffect(() => {
      setTempReferenceValue(null);
    }, [referenceValue]);

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
                    goToReference(loadedWork, tempReferenceValue || referenceValue);
                  }}
                  basic
                >
                  Go
                </Button>
              )}
              placeholder="Jump to reference..."
              value={tempReferenceValue || referenceValue}
              error={!referenceValid}
              onChange={(e, d) => changeReference(e, d)}
              onKeyPress={(e, d) => onKeyPressed(e, d)}
            />
          </Menu.Item>
        )}
          <div style={{ float: "right", marginLeft: "auto", marginTop: 11 }}>
            <Responsive minWidth={768}>
              <Dropdown icon="ellipsis vertical" direction="left">
                <Dropdown.Menu>
                  <Dropdown.Item
                    text="About TextCritical.net"
                    onClick={() => openAboutModal()}
                  />
                  <Dropdown.Item
                    text="Go to Start Page"
                    onClick={() => openStartPage()}
                  />
                  <Dropdown.Item
                    text="Convert beta-code to Greek"
                    onClick={() => openBetaCodePage()}
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
  goToPriorChapter: PropTypes.func.isRequired,
  goToNextChapter: PropTypes.func.isRequired,
  referenceValue: PropTypes.string,
  hasNextChapter: PropTypes.bool,
  hasPriorChapter: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
}

ReadingMenuBar.defaultProps = {
  referenceValue: '',
  authors: [],
  relatedWorks: [],
  loadedWork: null,
  bookSelectionOpen: false,
  hasNextChapter: false,
  hasPriorChapter: false,
}

export default withRouter(ReadingMenuBar);
