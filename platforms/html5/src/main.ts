'use strict';

import config from './config';
import ui from './dialog';
import SWAGAPI from './api';

import './styles/main.scss';

declare global {
  interface Window {
    SWAGAPI: APIWrapper;
  }
}

console.log('SWAG API ' + config.version);

export default class APIWrapper {
  getInstance (options: any) {
    console.log(options);
    return new SWAGAPI(options);
  }

  showBrandingAnimation (element: string, callback: () => {}) {
    return ui.showBrandingAnimation(element, callback);
  }

  showLeaderboard () {
    return ui.leaderboardComponent();
  }
}

window.SWAGAPI = new APIWrapper();
