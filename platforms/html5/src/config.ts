import { version } from '../package.json';

function getApiRoot () {
  if (window.location.href.includes('env=staging')) {
    if (import.meta.env.MODE === 'development') {
      return import.meta.env.VITE_API_DEVELOPMENT_URL;
    } else {
      return import.meta.env.VITE_API_STAGING_URL;
    }
  }
  
  return import.meta.env.VITE_API_URL;
}

export interface Config {
  version: string;
  apiRoot: string;
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
  // events: {
  //   API_COMMUNICATION_ERROR: 'API_COMMUNICATION_ERROR',
  //   SESSION_READY: 'SESSION_READY',
  //   ERROR: 'ERROR',
  //   INVALID_MESSAGE: 'INVALID MESSAGE'
  // }
};

export default config;
