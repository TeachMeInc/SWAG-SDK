'use strict';

import config from './config';
import ui from './dialog';
import SWAGAPI, { SWAGAPIOptions } from './api';

import './styles/main.scss';

// eslint-disable-next-line no-console
console.log('SWAG HTML5 SDK ' + config.version);

export default class APIWrapper {
  getInstance (options: SWAGAPIOptions) {
    return new SWAGAPI(options);
  }

  getInstanceAsync (options: SWAGAPIOptions) {
    // eslint-disable-next-line no-console
    console.warn('getInstanceAsync is deprecated. Please use getInstance instead.');
    return new Promise((resolve) => {
      resolve(this.getInstance(options));
    });
  }

  showBrandingAnimation (element: string, callback: () => {}) {
    return ui.showBrandingAnimation(element, callback);
  }

  showLeaderboard () {
    return ui.leaderboardComponent();
  }
}

window.SWAGAPI = new APIWrapper();
