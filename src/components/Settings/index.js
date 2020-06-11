const LAST_READ_HISTORY = "lastReadHistory";
export function maxHistoryCount(){
  return 5;
}

export function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

export function getWorksLastRead() {
  const lastReadHistory = localStorage.getItem(LAST_READ_HISTORY);

  if (lastReadHistory) {
    try {
      const lastReadHistoryParsed = JSON.parse(lastReadHistory);

      // Make sure that the list is an array and has the necesary properties.
      return lastReadHistoryParsed.filter((entry) => {
        return entry.workTitleSlug;
      });
    }
    catch(err) {
      // eslint-disable-next-line no-console
      console.warn('The list of last read works could not be loaded');
      return null; // The list could not be loaded
    }
  }

  return null;
}

export function setWorkProgress(workTitleSlug, divisions, divisionReference) {
  if (storageAvailable("localStorage")) {
    // See if the entry exists already
    let lastReadHistory = getWorksLastRead();

    // Initialize the history object if we don't have one yet
    if (lastReadHistory === null) {
      lastReadHistory = [];
    } else {
      lastReadHistory = JSON.parse(lastReadHistory);
    }

    // Find the existing index if it exists
    const index = lastReadHistory.findIndex(
      (entry) => entry.workTitleSlug === workTitleSlug
    );

    // Get the existing entry or initial it
    const lastReadEntry = index >= 0 ? lastReadHistory[index] : {};

    // Update the history to remove the existing entry
    if (index >= 0) {
      lastReadHistory = [
        ...lastReadHistory.slice(0, index),
        ...lastReadHistory.slice(index + 1),
      ];
    }

    // Set the entry
    lastReadEntry.workTitleSlug = workTitleSlug;
    lastReadEntry.divisions = divisions;
    lastReadEntry.divisionReference = divisionReference;

    // Splice it in
    lastReadHistory.splice(0, 0, lastReadEntry);

    // Shorten the list to the limit
    if (lastReadHistory.length > maxHistoryCount()) {
      lastReadHistory = lastReadHistory.slice(0, maxHistoryCount());
    }

    // Update the history
    localStorage.setItem(LAST_READ_HISTORY, JSON.stringify(lastReadHistory));
  }
}

export function clearWorksLastRead() {
  localStorage.removeItem(LAST_READ_HISTORY);
}
