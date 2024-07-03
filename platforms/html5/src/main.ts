'use strict';

import config from './config';
import ui from './dialog';
import SWAGAPI from './api';

import './styles/main.scss';

// eslint-disable-next-line no-console
console.log('SWAG HTML5 SDK ' + config.version);

export default class APIWrapper {
  getInstance (options: any) {
    // eslint-disable-next-line no-console
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
