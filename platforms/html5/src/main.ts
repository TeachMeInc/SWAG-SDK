'use strict';

import config from './config';
import ui from './dialog';
import SWAGAPI from './api';

import './styles/main.scss';
import session from './session';

// eslint-disable-next-line no-console
console.log('SWAG HTML5 SDK ' + config.version);

export default class APIWrapper {
  getInstance (options: any) {
    // eslint-disable-next-line no-console
    console.log(options);
    const instance = new SWAGAPI(options);

    // If a JWT token is provided externally, then use that
    const token = instance.getExternalToken();
    if (typeof token === 'string') {
      session.jwt = token;
    }

    // Otherwise rely on cookie (default) authentication; do nothing
    return instance;
  }

  getInstanceAsync (options: any) {
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
