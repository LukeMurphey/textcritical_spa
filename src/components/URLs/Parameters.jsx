/**
 * This contains the functions for making the URL parameters (that part past the ? in the URL).
 */

/**
 * Append a leading question mark if necessary.
 * @param {string} url 
 * @returns 
 */
export function appendLeadingQuestionMark(url) {
  return url.length === 0 ? url : `?${url}`;
}

/**
 * Append an ampersand if necessary if the URL already has at least one argument.
 * @param {*} url The URL that is going to be appended to.
 * @param {*} params The parameters that you want to append.
 * @returns The parameter with an ampersand if necessary.
 */
export function appendAmpersand(url, params) {
  return url.length > 0 ? `&${params}` : params;
}

export function PARAMS_SEARCH(
  q = "",
  ignoreDiacritics = false,
  searchRelatedForms = false,
  page = ""
) {
  let url = "";

  if (q) {
    url += appendAmpersand(url, `q=${q}`);
  }

  if (page) {
    url += appendAmpersand(url, `page=${page}`);
  }

  if (ignoreDiacritics) {
    url += appendAmpersand(url, "ignore_diacritics=1");
  }

  if (searchRelatedForms) {
    url += appendAmpersand(url, "include_related=1");
  }


  return appendLeadingQuestionMark(url)
}

export function PARAMS_READ_WORK(
  parallelWork = null,
) {
  let url = "";

  if (parallelWork) {
    url += appendAmpersand(url, `parallel=${parallelWork}`);
  }

  return appendLeadingQuestionMark(url)
}

export function PARAMS_PERSEUS_WORD_LOOKUP(word = '') {
  let url = "";

  if (word) {
    url += `l=${word}&la=greek`;
  }

  return appendLeadingQuestionMark(url)
}

export function PARAMS_GOOGLE_SEARCH(q = '') {
  let url = "";

  if (q) {
    url = `q=${q}`;
  }

  return appendLeadingQuestionMark(url)
}