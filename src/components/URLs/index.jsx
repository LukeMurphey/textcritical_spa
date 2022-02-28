/**
 * This page provides helper functions for creating URLs for the website.
 */

import { BASE_PATH_START_PAGE, BASE_PATH_BETA_CODE_CONVERT, BASE_PATH_READ_WORK, BASE_PATH_SEARCH, BASE_PATH_GOOGLE_SEARCH, BASE_PATH_PERSEUS_WORD_LOOKUP, BASE_PATH_LOGEION_WORD_LOOKUP } from "./BasePaths";
import { PARAMS_SEARCH, PARAMS_GOOGLE_SEARCH, PARAMS_PERSEUS_WORD_LOOKUP, PARAMS_READ_WORK } from "./Parameters";

export function START_PAGE() {
  return BASE_PATH_START_PAGE;
}

export function BETA_CODE_CONVERT() {
  return BASE_PATH_BETA_CODE_CONVERT;
}

export function READ_WORK(work = '', secondWork = null, ...divisions) {
  let divisionReference = '';

  const divisionsFiltered = divisions.filter((entry) => entry);

  if (divisions.length > 0 && work) {
    divisionReference = divisionsFiltered.join('/');
    return `${BASE_PATH_READ_WORK}/${work}/${divisionReference}${PARAMS_READ_WORK(secondWork)}`;
  }

  return `${BASE_PATH_READ_WORK}/${work}`;
}

export function SEARCH(
  q = '',
  ignoreDiacritics = false,
  searchRelatedForms = false,
  page = '',
) {
  return `${BASE_PATH_SEARCH}${PARAMS_SEARCH(q, ignoreDiacritics, searchRelatedForms, page)}`;
}

export function GOOGLE_SEARCH(q = '') {
  return `${BASE_PATH_GOOGLE_SEARCH}${PARAMS_GOOGLE_SEARCH(q)}`;
}

export function PERSEUS_WORD_LOOKUP(word = '') {
  return `${BASE_PATH_PERSEUS_WORD_LOOKUP}${PARAMS_PERSEUS_WORD_LOOKUP(word)}`;
}

export function LOGEION_WORD_LOOKUP(word = '') {
  return `${BASE_PATH_LOGEION_WORD_LOOKUP}/${word}`;
}
