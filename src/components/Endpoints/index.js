
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
