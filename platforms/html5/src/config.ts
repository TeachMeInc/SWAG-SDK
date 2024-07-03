import pkg from '../package.json';

export interface Config {
  version: string;
  themes: {
    [key: string]: {
      apiRoot: string;
      active: boolean;
    };
  };
  providers: {
    [key: string]: {
      root: string;
      current: string;
      login: string;
      logout: string;
      create: string;
    };
  };
  resourceRoot: string;
  events: {
    API_COMMUNICATION_ERROR: string;
    SESSION_READY: string;
    DIALOG_CLOSED: string;
    INVALID_DIALOG_TYPE: string;
    ERROR: string;
    INVALID_MESSAGE: string;
  };
}

const config: Config = {
  version: pkg.version,
  themes: {
    'shockwave': {
      apiRoot: 'https://swag-services.shockwave.com',
      active: true
    },
  },
  providers: {
    'shockwave': {
      root: 'https://www.shockwave.com',
      current: '/shockwave-auth/current',
      login: '/shockwave-auth/login',
      logout: '/shockwave-auth/logout',
      create: '/shockwave-auth/create'
    }
  },
  resourceRoot: 'https://swagapi.shockwave.com/dist/',
  events: {
    API_COMMUNICATION_ERROR: 'API_COMMUNICATION_ERROR',
    SESSION_READY: 'SESSION_READY',
    DIALOG_CLOSED: 'DIALOG_CLOSED',
    INVALID_DIALOG_TYPE: 'INVALID_DIALOG_TYPE',
    ERROR: 'ERROR',
    INVALID_MESSAGE: 'INVALID MESSAGE'
  }
};

export default config;
