/**
 * This page provides helper functions for creating URLs for the website.
 */

export function READ_WORK(work = '', ...divisions) {
  let divisionReference = '';

  if (divisions && work) {
    divisionReference = divisions.join('/');
  }

  return `/work/${work}/${divisionReference}`;
}

export function SEARCH(
  q = '',
  ignoreDiacritics = false,
  searchRelatedForms = false,
  page = 1,
) {
  let url = `/search?q=${q}`;

  if (page) {
    url += `&page=${page}`;
  }

  if (ignoreDiacritics) {
    url += '&ignore_diacritics=1';
  }

  if (searchRelatedForms) {
    url += '&include_related=1';
  }

  return url;
}

export function GOOGLE_SEARCH(q = '') {
  return `https://www.google.com/search?q=${q}`;
}

export function PERSEUS_WORD_LOOKUP(word = '') {
  return `http://www.perseus.tufts.edu/hopper/morph?l=${word}&la=greek`;
}

export function LOGEION_WORD_LOOKUP(word = '') {
  return `https://logeion.uchicago.edu/${word}`;
}
