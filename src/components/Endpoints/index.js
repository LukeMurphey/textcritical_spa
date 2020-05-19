
/**
 * The following provides a way to map REST calls to another service (for development).
 */
const config = {
  // localhost: 'http://localhost:8080',
};

/**
 * This function determines what host to use for REST calls based on the hostname.
 * @param {*} origin The host to find the REST call domain for
 */
export function getHostConfig(origin = window.location.hostname) {
  if (origin in config) {
    return config[origin];
  }

  return '';
}

export function ENDPOINT_READ_WORK(work = '', ...divisions) {
  let divisionReference = '';

  if (divisions && work) {
    divisionReference = divisions.join('/');
  }

  return `${getHostConfig()}/api/work/${work}/${divisionReference}`;
}

export function ENDPOINT_WORK_INFO(work) {
  return `${getHostConfig()}/api/work_info/${work}`;
}

export function ENDPOINT_WORK_IMAGE(work, width = 100) {
  return `${getHostConfig()}/api/work_image/${work}?width=${width}`;
}

export function ENDPOINT_WORK_DOWNLOAD(work, format = 'epub') {
  return `${getHostConfig()}/api/download/work/${work}?format=${format}`;
}

export function ENDPOINT_RESOLVE_REFERENCE(work, reference) {
  return `${getHostConfig()}/api/resolve_reference/?work=${work}&ref=${reference}`;
}

export function ENDPOINT_WIKI_INFO(search, search2 = null, search3 = null) {
  const searchParams = [search, search2, search3].filter((e) => e != null);
  return `${getHostConfig()}/api/wikipedia_info/${searchParams.join('/')}`;
}

export function ENDPOINT_WORD_PARSE(word) {
  return `${getHostConfig()}/api/word_parse/${word}`;
}

export function ENDPOINT_WORKS_LISTS() {
  return `${getHostConfig()}/api/works`;
}

export function ENDPOINT_VERSION_INFO() {
  return `${getHostConfig()}/api/version_info`;
}

export function ENDPOINT_SEARCH(query, page = 1, relatedForms = false, ignoreDiacritics = false) {
  let relatedFormsConverted = 0;
  if (relatedForms) {
    relatedFormsConverted = 1;
  }

  let ignoreDiacriticsConverted = 0;
  if (ignoreDiacritics) {
    ignoreDiacriticsConverted = 1;
  }

  return `${getHostConfig()}/api/search/${encodeURIComponent(query)}?page=${page}&related_forms=${relatedFormsConverted}&ignore_diacritics=${ignoreDiacriticsConverted}`;
}
