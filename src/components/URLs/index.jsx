/**
 * This page provides helper functions for creating URLs for the website.
 */

export function READ_WORK(work = '', ...divisions) {
  let divisionReference = '';

  const divisionsFiltered = divisions.filter((entry) => entry);

  if (divisions.length > 0 && work) {
    divisionReference = divisionsFiltered.join('/');
    return `/work/${work}/${divisionReference}`;
  }

  return `/work/${work}`;
}

export function SEARCH(
  q = '',
  ignoreDiacritics = false,
  searchRelatedForms = false,
  page = '',
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
