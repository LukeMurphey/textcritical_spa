import {COOKIE_ACCEPTED} from ".";

export function setCookiesAccepted(storageOverride = null) {
  const storage = storageOverride || localStorage;
  storage.setItem(COOKIE_ACCEPTED, true);
}

export function getCookiesAccepted(storageOverride = null) {
  const storage = storageOverride || localStorage;
  const accepted = storage.getItem(COOKIE_ACCEPTED) || false;

  if( accepted === "true") {
    return true;
  }
  
  return false;
}
