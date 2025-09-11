'use strict';

import config from './config';
import SWAGAPI, { SWAGAPIOptions } from './api';

import './styles/main.scss';
import 'virtual:svg-to-font.css';

// eslint-disable-next-line no-console
console.log('SWAG HTML5 SDK ' + config.version);

export default class APIWrapper {
  getInstance (options: SWAGAPIOptions) {
    return new SWAGAPI(options);
  }
}

window.SWAGAPI = new APIWrapper();
