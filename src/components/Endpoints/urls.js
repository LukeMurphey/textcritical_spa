
/**
 * The following provides a way to map REST calls to another service (for development).
 */
 import { appendAmpersand } from '../Utils';
 
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

  if (divisions.length > 0 && work) {
    divisionReference = divisions.join('/');
    return `${getHostConfig()}/api/work/${work}/${divisionReference}`;
  }

  return `${getHostConfig()}/api/work/${work}`;
}

export function ENDPOINT_WORK_TEXT(work = '', ...divisions) {

  let divisionReference = '';

  if (divisions.length > 0 && work) {
    divisionReference = divisions.join('/');
    return `${getHostConfig()}/api/work_text/${work}/${divisionReference}`;
  }

  return `${getHostConfig()}/api/work_text/${work}`;
}

export function ENDPOINT_CHAPTER_DOWNLOAD(work = '', ...divisions) {

  let divisionReference = '';

  if (divisions.length > 0 && work) {
    divisionReference = divisions.join('/');
    return `${getHostConfig()}/api/download_chapter/${work}/${divisionReference}`;
  }

  return `${getHostConfig()}/api/download_chapter/${work}`;
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

export function ENDPOINT_WORD_FORMS(word) {
  return `${getHostConfig()}/api/word_forms/${word}`;
}

export function ENDPOINT_WORKS_LISTS() {
  return `${getHostConfig()}/api/works`;
}

export function ENDPOINT_VERSION_INFO() {
  return `${getHostConfig()}/api/version_info`;
}

export function ENDPOINT_SOCIAL_LOGIN() {
  return `${getHostConfig()}/api/social_auth`;
}

export function ENDPOINT_SEARCH(query, page = 1, relatedForms = false, ignoreDiacritics = false, download = null, pagelen = null) {
  let relatedFormsConverted = 0;
  if (relatedForms) {
    relatedFormsConverted = 1;
  }

  let ignoreDiacriticsConverted = 0;
  if (ignoreDiacritics) {
    ignoreDiacriticsConverted = 1;
  }

  let url = '';

  if (page) {
    url += appendAmpersand(url, `page=${page}`);
  }

  if (pagelen) {
    url += appendAmpersand(url, `pagelen=${pagelen}`);
  }

  url += appendAmpersand(url, `ignore_diacritics=${ignoreDiacriticsConverted}`);
  url += appendAmpersand(url, `related_forms=${relatedFormsConverted}`);

  if (download) {
    url += appendAmpersand(url, `download=`);
  }

  return `${getHostConfig()}/api/search/${encodeURIComponent(query)}?${url}`;
}

export function ENDPOINT_CONVERT_BETA_CODE_QUERY(query) {
  return `${getHostConfig()}/api/convert_query_beta_code/?q=${query}`;
}

/*
 * User preferences
 */
export function ENDPOINT_USER_PREFERENCES() {
  return `${getHostConfig()}/api/user_preferences`;
}

export function ENDPOINT_USER_PREFERENCE_EDIT(name) {
  return `${getHostConfig()}/api/user_preference/edit/${name}`;
}

export function ENDPOINT_USER_PREFERENCE_DELETE(name) {
  return `${getHostConfig()}/api/user_preference/delete/${name}`;
}

/*
 * Notes
 */
export function ENDPOINT_NOTE(noteId) {
  return `${getHostConfig()}/api/notes/${noteId}/`;
}

export function ENDPOINT_NOTES(work = null, division = null, search = null, includeRelated = false) {

  let query = '';

  if (work) {
    query += appendAmpersand(query, `work=${work}`);
  }

  if (division) {
    query += appendAmpersand(query, `division=${division}`);
  }

  if (search && search.length > 0) {
    query += appendAmpersand(query, `search=${search}`);
  }

  if (includeRelated) {
    query += appendAmpersand(query, "include_related=1");
  }

  return `${getHostConfig()}/api/notes/?${query}`;
}

export function ENDPOINT_NOTE_EDIT(noteId = null, beForgiving=false) {

  let query = '';

  if (beForgiving) {
    query = "be_forgiving=1";
  }

  if(!noteId) {
    return `${getHostConfig()}/api/notes/edit/?${query}`;
  }
  return `${getHostConfig()}/api/notes/edit/${noteId}/?${query}`;
}

export function ENDPOINT_NOTE_DELETE(noteId) {
  return `${getHostConfig()}/api/notes/delete/${noteId}/`;
}

export function ENDPOINT_EXPORT_NOTES() {
  return `${getHostConfig()}/api/export_notes/`;
}

export function ENDPOINT_NOTES_META_DATA(work = null, division = null, includeRelated = false) {

  let query = '';

  if (work) {
    query += appendAmpersand(query, `work=${work}`);
  }

  if (division) {
    query += appendAmpersand(query, `division=${division}`);
  }

  if (includeRelated) {
    query += appendAmpersand(query, "include_related=1");
  }

  return `${getHostConfig()}/api/notes_metadata/?${query}`;
}
