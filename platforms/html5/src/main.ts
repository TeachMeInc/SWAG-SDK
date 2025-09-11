'use strict';

import './styles/main.scss';
import 'virtual:svg-to-font.css';

import config from '@/config';
import SWAGAPI, { SWAGAPIOptions } from '@/SWAGAPI';

// eslint-disable-next-line no-console
console.log('SWAG HTML5 SDK ' + config.version);

class APIWrapper {
  getInstance (options: SWAGAPIOptions) {
    return new SWAGAPI(options);
  }
}

window.SWAGAPI = new APIWrapper();
