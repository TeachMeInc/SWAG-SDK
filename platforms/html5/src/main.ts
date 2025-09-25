'use strict';

import './styles/main.scss';
import 'virtual:svg-to-font.css';

import config from '@/config';
import SWAGAPI, { SWAGAPIOptions } from '@/SWAGAPI';
import utils from '@/utils';

utils.log('HTML5 SDK v' + config.version);
utils.log('For documentation, visit https://developers.shockwave.com/');

class APIWrapper {
  getInstance (options: SWAGAPIOptions) {
    return new SWAGAPI(options);
  }
}

window.SWAGAPI = new APIWrapper();
