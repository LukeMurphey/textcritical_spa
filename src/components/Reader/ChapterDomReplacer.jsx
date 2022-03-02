/* eslint-disable react/prop-types */
import { domToReact } from "html-react-parser";
import React from 'react';
import { indexOfNoDiacritic } from "../Utils";

const getDomReplaceFunction = (
  highlightedWords,
  verseIdentifierPrefix,
  highlightedVerse
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

    // Stop if this isn't a verse
    if (!attribs || !("data-verse" in attribs)) return undefined;

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
  };
};

export default getDomReplaceFunction;
