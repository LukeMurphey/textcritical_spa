/**
 * This modules is responsible for extracting the events from the chapter content. This is
 * necessary when event handlers fire on content in the chapter.
 */

 export const CONTEXT_WORD = 0;
 export const CONTEXT_VERSE = 1;
 export const CONTEXT_NOTE = 2;
 export const CONTEXT_EMPTY = 3;

 export const determineEventTargetType = (event) => {
  // Determine if we are clicking a word, verse, note, or just empty space
  if (event.target.className.includes("word")) {
    return CONTEXT_WORD;
  }
  
  if (event.target.className.includes("verse")) {
    return CONTEXT_VERSE;
  }
  
  if (event.target.className.includes("note-tag")) {
    return CONTEXT_NOTE;
  }

  return CONTEXT_EMPTY;
};

/**
 * Get the verse information from the event.
 * @param {*} event 
 * @returns { verseDescriptor, verse, id, href }
 */
export const getVerseInfoFromEvent = (event) => {
  // Get the target containing the verse info
  const target = event.target.parentElement;

  // Get the descriptor of the verse
  const verseDescriptorElem = Array.from(target.attributes).find(
    (element) => element.name === "data-verse-descriptor"
  );
  const verseDescriptor = verseDescriptorElem
    ? verseDescriptorElem.nodeValue
    : null;

  // Get the ID
  const { id } = target;

  // Get the the href
  let href;

  if (target.attributes.href) {
    href = target.attributes.href.nodeValue;
  } else {
    href = null;
  }

  // Get the verse number
  const verseElem = Array.from(target.attributes).find(
    (element) => element.name === "data-verse"
  );
  const verse = verseElem ? verseElem.nodeValue : null;

  // Stop if we didn't get what we needed to continue
  if (!verseDescriptor) {
    return { verseDescriptor: null, verse: null, id: null, href: null };
  }

  return { verseDescriptor, verse, id, href };
};

export const getWordFromEvent = (event) => {
  if (event.target.className.includes("word")) {
    return event.target.innerText;
  }

  return null;
};

export const getNoteFromEvent = (event) => {
    // Get the ID
    const { id } = event.target;

    // Get the contents for the given ID
    const contentsElem = document.getElementById(`content_for_${id}`);
    let contents = ["Note content could not be found"];

    if (contentsElem) {
      contents = [contentsElem.textContent];
    }

    return { contents, id };
};

export const getEventInfo = (event) => {
  const eventType = determineEventTargetType(event);

  if(eventType === CONTEXT_WORD) {
    return [eventType, getWordFromEvent(event)];
  }

  if(eventType === CONTEXT_NOTE) {
    return [eventType, getNoteFromEvent(event)];
  }

  if(eventType === CONTEXT_VERSE) {
    return [eventType, getVerseInfoFromEvent(event)];
  }

  return [eventType, null];
}
