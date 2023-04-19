import {LAST_READ_HISTORY, FAVORITE_WORKS} from ".";
import { storageAvailable } from "./LocalStorage";

export function maxHistoryCount() {
  return 6;
}

function chooseStorage(storageOverride = null) {
  // Figure out what version of storage to use
  if (storageOverride !== null){
    return storageOverride;
  }

  if (storageAvailable()){
    return localStorage;
  }
  console.warn('Local storage is not available!!');
  return null;
}

export function getWorksList(name, storageOverride = null) {
  const storage = chooseStorage(storageOverride);

  if(storage) {
    const worksList = storage.getItem(name);

    if (worksList) {
      try {
        const worksListParsed = JSON.parse(worksList);

        // Make sure that the list is an array and has the necessary properties.
        return worksListParsed.filter((entry) => {
          return entry.workTitleSlug;
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("The list of works could not be loaded");
        return null; // The list could not be loaded
      }
    }
  }

  return null;
}

export function getWorksLastRead(storageOverride = null) {
  return getWorksList(LAST_READ_HISTORY, storageOverride);
}

export function getFavoriteWorks(storageOverride = null) {
  return getWorksList(FAVORITE_WORKS, storageOverride);
}

export function setFavoriteWork(
  workTitleSlug,
  storageOverride = null
) {
  const storage = chooseStorage(storageOverride);

  if (storage) {
    // See if the entry exists already
    let favoriteWorks = getFavoriteWorks(storage);

    // Initialize the history object if we don't have one yet
    if (favoriteWorks === null) {
      favoriteWorks = [];
    }

    // Find the existing index if it exists
    const index = favoriteWorks.findIndex(
      (entry) => entry.workTitleSlug === workTitleSlug
    );

    // Get the existing entry or initial it
    const favoriteEntry = index >= 0 ? favoriteWorks[index] : {};

    // Update the records to remove the existing entry
    if (index >= 0) {
      favoriteWorks = [
        ...favoriteWorks.slice(0, index),
        ...favoriteWorks.slice(index + 1),
      ];
    }

    // Set the entry
    favoriteEntry.workTitleSlug = workTitleSlug;

    // Splice it in
    favoriteWorks.splice(0, 0, favoriteEntry);

    // Shorten the list to the limit
    if (favoriteWorks.length > maxHistoryCount()) {
      favoriteWorks = favoriteWorks.slice(0, maxHistoryCount());
    }

    // Update the history
    storage.setItem(FAVORITE_WORKS, JSON.stringify(favoriteWorks));
  }
}

export function removeFavoriteWork(
  workTitleSlug,
  storageOverride = null
) {
  const storage = chooseStorage(storageOverride);

  if (storage) {
    // See if the entry exists already
    let favoriteWorks = getFavoriteWorks(storage);

    const index = favoriteWorks.findIndex(
      (entry) => entry.workTitleSlug === workTitleSlug
    );

    // Update the history to remove the existing entry
    if (index >= 0) {
      favoriteWorks = [
        ...favoriteWorks.slice(0, index),
        ...favoriteWorks.slice(index + 1),
      ];

      // Update the history
      storage.setItem(FAVORITE_WORKS, JSON.stringify(favoriteWorks));
    }
  }
}

export function setFavoritesProgress(
  workTitleSlug,
  divisions,
  divisionReference,
  storageOverride = null
) {
  const storage = chooseStorage(storageOverride);

  if (storage) {
    // See if the entry exists in the list of favorites
    let favoriteWorks = getFavoriteWorks(storage);

    if (!favoriteWorks) {
      favoriteWorks = [];
    }

    const index = favoriteWorks.findIndex(
      (entry) => entry.workTitleSlug === workTitleSlug
    );

    // Update the entry if it exists
    if (index >= 0) {
      favoriteWorks[index].divisions = divisions;
      favoriteWorks[index].divisionReference = divisionReference;

      // Update the list
      storage.setItem(FAVORITE_WORKS, JSON.stringify(favoriteWorks));
    }
  }
}

export function setWorkProgress(
  workTitleSlug,
  divisions,
  divisionReference,
  storageOverride = null
) {
  const storage = chooseStorage(storageOverride);

  if (storage) {

    // See if the entry exists already
    let lastReadHistory = getWorksLastRead(storage);

    // Initialize the history object if we don't have one yet
    if (lastReadHistory === null) {
      lastReadHistory = [];
    }

    // Find the existing index if it exists
    const index = lastReadHistory.findIndex(
      (entry) => entry.workTitleSlug === workTitleSlug
    );

    // Get the existing entry or initialize it
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
    storage.setItem(LAST_READ_HISTORY, JSON.stringify(lastReadHistory));

    setFavoritesProgress(workTitleSlug, divisions, divisionReference, storageOverride);
  }
}

export function clearWorksLastRead(storageOverride = null) {
  const storage = chooseStorage(storageOverride);
  storage.removeItem(LAST_READ_HISTORY);
}

export function clearFavorites(storageOverride = null) {
  const storage = chooseStorage(storageOverride);
  storage.removeItem(FAVORITE_WORKS);
}
