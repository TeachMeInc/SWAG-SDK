'use strict';

import config from './config';
import ui from './dialog';
import SWAGAPI from './api';

import './styles/main.scss';
import session from './session';

// eslint-disable-next-line no-console
console.log('SWAG HTML5 SDK ' + config.version);

export default class APIWrapper {
  getInstance (options: any, onReady?: (instance: SWAGAPI) => void) {
    // eslint-disable-next-line no-console
    console.log(options);
    const instance = new SWAGAPI(options);

    // If a JWT token is provided externally, then use that
    const token = instance.getExternalToken();
    if (typeof token === 'string') {
      session.jwt = token;
      onReady?.(instance);
    }

    // For standalone (static hosted) games, generate a guest token
    else if (instance.getPlatform() === 'standalone') {
      (async () => {
        const guestToken = await instance.generateGuestToken();
        session.jwt = guestToken;
        onReady?.(instance);
      })();
    }

    // Otherwise rely on cookie (default) authentication; do nothing
    else {
      onReady?.(instance);
    }

    return instance;
  }

  async getInstanceAsync (options: any) {
    // eslint-disable-next-line no-console
    console.log(options);
    const instance = new SWAGAPI(options);

    // If a JWT token is provided externally, then use that
    const token = instance.getExternalToken();
    if (typeof token === 'string') {
      session.jwt = token;
    }

    // For standalone (static hosted) games, generate a guest token
    else if (instance.getPlatform() === 'standalone') {
      const guestToken = await instance.generateGuestToken();
      session.jwt = guestToken;
    }

    // Otherwise rely on cookie (default) authentication; do nothing

    return instance;
  }

  showBrandingAnimation (element: string, callback: () => {}) {
    return ui.showBrandingAnimation(element, callback);
  }

  showLeaderboard () {
    return ui.leaderboardComponent();
  }
}

window.SWAGAPI = new APIWrapper();
