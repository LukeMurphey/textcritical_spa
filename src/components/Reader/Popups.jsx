import React from 'react';
import PropTypes from 'prop-types';
import WordInformation from "../WordInformation/WordInformationPopup";
import FootnotePopup from "../FootnotePopup";
import ContextPopup from "../ContextPopup";
import { GlobalAppContext } from "../GlobalAppContext";

export const MODAL_WORD = "word";
export const MODAL_FOOTNOTE = "footnote";
export const MODAL_USERNOTE = "note";
export const MODAL_CONTEXT = "context";

const Popups = ({
    modal,
    data,
    loading,
    selectedWord,
    popupX,
    popupY,
    popupPositionRight,
    popupPositionBelow,
    selectedNote,
    loadedWork,
    closeModal,
    searchState,
    inverted,
    popupContextData
}) => {
    const { features } = React.useContext(GlobalAppContext);

    return (
      <>
        {selectedWord && !loading && modal === MODAL_WORD && (
        <WordInformation
          inverted={inverted}
          positionBelow={popupPositionBelow}
          positionRight={popupPositionRight}
          x={popupX}
          y={popupY}
          word={selectedWord}
          work={loadedWork}
          onClose={() => closeModal()}
          searchState={searchState}
        />
        )}
        {selectedNote && !loading && modal === MODAL_FOOTNOTE && (
        <FootnotePopup
          inverted={inverted}
          positionBelow={popupPositionBelow}
          positionRight={popupPositionRight}
          x={popupX}
          y={popupY}
          notes={selectedNote}
          onClose={() => closeModal()}
        />
        )}
        {data && !loading && modal === MODAL_CONTEXT && features.contextMenuEnabled && (
        <ContextPopup
          inverted={inverted}
          positionBelow={popupPositionBelow}
          positionRight={popupPositionRight}
          x={popupX}
          y={popupY}
          data={data}
          onClose={() => closeModal()}
          contextType={popupContextData.contextType}
          contextData={popupContextData.contextData}
        />
        )}
      </>
    )
};

Popups.propTypes = {
    modal: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    selectedWord: PropTypes.string,
    popupX: PropTypes.number.isRequired,
    popupY: PropTypes.number.isRequired,
    popupPositionRight: PropTypes.bool.isRequired,
    popupPositionBelow: PropTypes.bool.isRequired,
    selectedNote: PropTypes.string,
    loadedWork: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    searchState: PropTypes.object,
    inverted: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    popupContextData: PropTypes.object.isRequired,
};

Popups.defaultProps = {
    loading: false,
    searchState: {},
    selectedNote: "",
    selectedWord: "",
    loadedWork: null
};

export default Popups;
