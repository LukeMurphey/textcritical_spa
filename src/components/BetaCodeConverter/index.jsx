import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Container, Form, TextArea, Segment, Dimmer, Loader, Header } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ENDPOINT_CONVERT_BETA_CODE_QUERY } from '../Endpoints';
import { READ_WORK } from '../URLs';
import FullscreenDialog from '../FullscreenDialog';
import WordInformation from "../WordInformation/WordInformationPopup";
import ErrorMessage from '../ErrorMessage';
import { getPositionRecommendation } from '../PopupDialog';

const SegmentStyle = {
  marginTop: "20px",
};

const convertBetaCodeDebounced = AwesomeDebouncePromise(
  (originalText) =>
  fetch(ENDPOINT_CONVERT_BETA_CODE_QUERY(originalText)),
  500
);

const BetaCodeConverter = ({ inverted, history }) => {
  const [originalText, setOriginalText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // The following are related to the popup
  const [modal, setModal] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [popupX, setPopupX] = useState(null);
  const [popupY, setPopupY] = useState(null);
  const [popupPositionRight, setPopupPositionRight] = useState(null);
  const [popupPositionBelow, setPopupPositionBelow] = useState(null);

  const onClickBack = () => {
    history.push(READ_WORK());
  };

  const closeModal = () => {
    setModal(null)
  };

  const convertText = (text) => {
    const testSplit = text.split(" ");
    return testSplit.map(t => (
      <>
        <span className="word">{t}</span>
        {' '}
      </>
    ));
  }

  const handleWordClick = event => {
    // Determine if we are clicking a word, verse, note, or just empty space
    if (event.target.className.includes('word')) {
      const word = event.target.textContent;
      const [right, below] = getPositionRecommendation(event);

      setPopupPositionRight(right);
      setPopupPositionBelow(below);
      setPopupX(event.layerX);
      setPopupY(event.layerY);
      setModal('word');
      setSelectedWord(word);
    }
  }

  const getWordInfo = txt => {
    setLoading(true);

    convertBetaCodeDebounced(txt)
      .then((res) => res.json())
      .then((data) => {
        setConvertedText(data);
        setLoading(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }

  useEffect(() => {
    window.addEventListener('click', handleWordClick);
    return () => {
      window.removeEventListener('click', handleWordClick);
    };
  }, [handleWordClick]);

  /**
   * Get the popups.
   */
  const getPopups = () => {
    return (
      <>
        {modal === "word" && (
          <WordInformation
            inverted={inverted}
            positionBelow={popupPositionBelow}
            positionRight={popupPositionRight}
            x={popupX}
            y={popupY}
            word={selectedWord}
            onClose={() => closeModal()}
          />
        )}
      </>
    );
  }

  return (
    <FullscreenDialog inverted={inverted} onClickBack={onClickBack} backTitle="Back to the Library">
      {getPopups()}
      <Container>
        {error && (
        <ErrorMessage
          title="Unable to load word information"
          description="Unable to get information about the text from the server"
          message={error}
        />
        )}
        <Segment inverted={inverted}>
          <Header as="h1">Greek text analysis</Header>
          <Form>
            Enter beta-code below and it will be converted to Greek Unicode automatically with the ability to look up individual words
            <TextArea
              placeholder='Enter Greek text or beta-code here'
              value={originalText}
              onChange={(event, data) => {
                setOriginalText(data.value);
                getWordInfo(data.value);
            }}
            />
            <div style={SegmentStyle} />
            {convertedText && (
              <>
                Results (click the word to do a morphological lookup):
                <Segment secondary inverted={inverted}>
                  { loading && (
                  <Dimmer active>
                    <Loader />
                  </Dimmer>
                  )}
                  {convertText(convertedText)}
                </Segment>
              </>
            )}
          </Form>
        </Segment>
      </Container>
    </FullscreenDialog>
  );
};

BetaCodeConverter.propTypes = {
  inverted: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

BetaCodeConverter.defaultProps = {
  inverted: false,
};

export default withRouter(BetaCodeConverter);
