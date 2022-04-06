/**
 * This contains the functions for making the URL parameters (that part past the ? in the URL).
 */

 import { appendAmpersand, appendLeadingQuestionMark } from '../Utils';

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