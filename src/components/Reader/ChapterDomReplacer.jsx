/* eslint-disable react/prop-types */
import { domToReact } from "html-react-parser";
import React from 'react';
import { indexOfNoDiacritic } from "../Utils";

const getDomReplaceFunction = (
  highlightedWords,
  verseIdentifierPrefix,
  highlightedVerse,
  notesMetaData
) => {
  return ({ attribs, children }) => {
    // Handle highlighted words
    if (
      attribs &&
      attribs.class === "word" &&
      highlightedWords &&
      children.length > 0 &&
      children[0].type === "text"
    ) {
      // Get the value of the word
      const wordText = children[0].data;

      // Get the index of the highlighted word
      const highlightIndex = indexOfNoDiacritic(highlightedWords, wordText);

      // Add the highlight tag if we have a match
      if (highlightIndex >= 0) {
        return (
          <span className={`word highlighted highlight${highlightIndex}`}>
            {domToReact(children)}
          </span>
        );
      }
    }

    // Process this if it is a verse
    if(attribs && attribs["data-verse"]) {
      // Set the highlighted class if this is a highlighted verse
      const verseClassName =
        attribs && attribs["data-verse"] === highlightedVerse
          ? "verse-link highlighted"
          : "verse-link";

      return (
        <a
          className={verseClassName}
          href={attribs.href}
          data-verse={attribs["data-verse"]}
          data-verse-descriptor={attribs["data-verse-descriptor"]}
          data-original-id={attribs.id}
          id={`${verseIdentifierPrefix}${attribs.id}`}
        >
          {domToReact(children)}
        </a>
      );
    }

    // Process this if it is a verse-container
    if(attribs && attribs.class === "verse-container") {

        // Set the indicator saying that it matches a note
        if (notesMetaData){
          // Get the verse ID
          const verseID = attribs.id;

          // Parse out the verse number
          const identifierMatch = /verse-([0-9]+)/g.exec(verseID);

          const identifier = identifierMatch[1];

          const notesMetaDataMatched = notesMetaData.find(metaData => metaData.verse_indicator === identifier);

          if (notesMetaDataMatched) {
            // eslint-disable-next-line no-param-reassign
            attribs.class += " noted";
          }
        }
    }

    return undefined;
  };
};

export default getDomReplaceFunction;
