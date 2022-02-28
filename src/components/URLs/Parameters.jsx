/**
 * This contains the functions for making the URL parameters (that part past the ? in the URL).
 */


export function PARAMS_SEARCH(
  q = "",
  ignoreDiacritics = false,
  searchRelatedForms = false,
  page = ""
) {
  let url = "";

  if (q) {
    url += `&q=${q}`;
  }

  if (page) {
    url += `&page=${page}`;
  }

  if (ignoreDiacritics) {
    url += "&ignore_diacritics=1";
  }

  if (searchRelatedForms) {
    url += "&include_related=1";
  }

  // Append the leading question mark if there are query parameters
  if (url.length > 0) {
    url = `?${url}`;
  }

  return url;
}

export function PARAMS_READ_WORK(
  parallelWork = null,
) {
  let url = "";

  if (parallelWork) {
    url += `&parallel=${parallelWork}`;
  }

  // Append the leading question mark if there are query parameters
  if (url.length > 0) {
    url = `?${url}`;
  }

  return url;
}

export function PARAMS_PERSEUS_WORD_LOOKUP(word = '') {
  let url = "";

  if (word) {
    url += `l=${word}&la=greek`;
  }

  // Append the leading question mark if there are query parameters
  if (url.length > 0) {
    url = `?${url}`;
  }

  return url;
}

export function PARAMS_GOOGLE_SEARCH(q = '') {
  let url = "";

  if (q) {
    url += `&q=${q}`;
  }

  // Append the leading question mark if there are query parameters
  if (url.length > 0) {
    url = `?${url}`;
  }
  
}