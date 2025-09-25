import { version } from '../package.json';

function getApiRoot () {
  if (window.location.href.includes('env=staging')) {
    return import.meta.env.VITE_API_STAGING_URL;
  }
  if (window.location.href.includes('env=development')) {
    return import.meta.env.VITE_API_DEVELOPMENT_URL;
  }
  return import.meta.env.VITE_API_URL;
}

function getDrupalRoot () {
  if (
    window.location.href.includes('env=development') ||
    window.location.href.includes('env=staging')
  ) {
    return import.meta.env.VITE_DRUPAL_STAGING_URL;
  }
  return import.meta.env.VITE_DRUPAL_URL;
}

export interface Config {
  version: string;
  apiRoot: string;
  drupalRoot: string;
  // events: {
  //   API_COMMUNICATION_ERROR: string;
  //   SESSION_READY: string;
  //   ERROR: string;
  //   INVALID_MESSAGE: string;
  // };
}

const config: Config = {
  version,
  apiRoot: getApiRoot(),
  drupalRoot: getDrupalRoot(),
  // events: {
  //   API_COMMUNICATION_ERROR: 'API_COMMUNICATION_ERROR',
  //   SESSION_READY: 'SESSION_READY',
  //   ERROR: 'ERROR',
  //   INVALID_MESSAGE: 'INVALID MESSAGE'
  // }
};

export default config;
