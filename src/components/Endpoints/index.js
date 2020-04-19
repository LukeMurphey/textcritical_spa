
/**
 * The following provides a way to map REST calls to another service (for development).
 */
const config = {
  localhost: 'http://localhost:8080',
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

export function ENDPOINT_READ_WORK(workReference = '') {
  return `${getHostConfig()}/api/work/${workReference}`;
}

export function ENDPOINT_WORK_INFO(work) {
  return `${getHostConfig()}/api/work_info/${work}`;
}

export function ENDPOINT_WORK_IMAGE(work, width = 100) {
  return `${getHostConfig()}/work_image/${work}?width=${width}`;
}

export function ENDPOINT_WORK_DOWNLOAD(work, format = 'epub') {
  return `${getHostConfig()}/download/work/${work}?format=${format}`;
}

export function ENDPOINT_RESOLVE_REFERENCE(work, reference) {
  return `${getHostConfig()}/api/resolve_reference/?work=${work}&ref=${reference}`;
}
