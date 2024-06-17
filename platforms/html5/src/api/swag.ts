'use strict';

import Emitter from 'component-emitter';
import elementResizeEvent from 'element-resize-event';
import config from '../config';
import session from '../session';
import utils from '../utils';
import data from './data';
import ui, { DialogOptions, DialogType } from './ui';
import { PostScoreOptions } from '../data';

declare global {
  interface Window {
    SWAGTHEME: string;
  }
}

export default class SWAGAPI extends Emitter {
  _options: any;

  constructor (options: any) {
    super();

    this._options = options;
    this._init();
    Emitter(this);

    ui.on('UI_EVENT', (event) => {
      this.emit(event, {type: event});
    });

    ui.on('UI_ERROR', (event) => {
      this._emitError(event);
    });

    ui.on('DATA_ERROR', (event) => {
      this._emitError(event);
    });

    data.on('DATA_EVENT', (event) => {
      this.emit('DATA_EVENT', {type: event});
    });

    data.on('DATA_ERROR', (event) => {
      this._emitError(event);
    });
  }

  _init () {
    const siteMode = this._getSiteMode();
    
    session.api_key = this._options.api_key;
    session.wrapper = this._options.wrapper;
    session.wrapper!.classList.add('swag-wrapper');
    session.theme = siteMode;
    session.provider = siteMode;

    elementResizeEvent(session.wrapper!, function() {
      setTimeout(function() {
        ui.resize();
      }, 400);
    });
  }

  _getSiteMode() {
    // priority for site mode is window.SWAGTHEME, swag options theme then based on domain hosting the game
    const domainTheme = location.hostname.split('.').reverse().splice(1,1).reverse().join('.');
    const reqTheme = window.SWAGTHEME || this._options.theme || domainTheme;
    return config.themes[reqTheme]
      ? reqTheme
      : 'shockwave';
  }

  _emitError (errorType: string) {
    this.emit('ERROR', { type: errorType });
  }

  _parseUrlOptions (prop: string) {
    const params: Record<string, string> = {};
    if(window.location.href.indexOf('?') === -1) {
      return params;
    }
    const search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    const definitions = search.split( '&' );
    definitions.forEach( function(val) {
      const parts = val.split( '=', 2 );
      params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
  }

  startSession () {
    return data.getEntity()
      .then(() => {
        utils.debug('session ready');
        this.emit(config.events.SESSION_READY, { session_ready: true });
      });
  }

  getScoreCategories () {
    return data.getScoreCategories();
  }

  getDays (limit: number) {
    return data.getDays(limit);
  }

  getScores (options: PostScoreOptions) {
    return data.getScores(options);
  }

  postScore (level_key: string, value: string, options: PostScoreOptions) {
    return data.postScore(level_key, value, options)
      .then(function() {
        if(options && options.confirmation === true) {
          alert(`Your score of ${value} has been submitted!`)
        }
      });
  }

  postDailyScore (day: string, level_key: string, value: string) {
    return data.postDailyScore(day, level_key, value);
  }

  getAchievementCategories () {
    return data.getAchievementCategories();
  }

  postAchievement (achievement_key: string) {
    return data.postAchievement(achievement_key);
  }

  getUserAchievements () {
    return data.getUserAchievements();
  }

  postDatastore (key: string, value: string) {
    return data.postDatastore(key, value);
  }

  getUserDatastore () {
    return data.getUserDatastore();
  }

  populateLevelSelect (domId: any) {
    return ui.populateLevelSelect(domId);
  }

  populateDaySelect (domId: any, limit: any) {
    return ui.populateDaySelect(domId, limit);
  }

  populateAchievementSelect (domId: any) {
    return ui.populateAchievementSelect(domId);
  }

  getCurrentEntity () {
    return session.entity;
  }

  showDialog (type: DialogType, options: DialogOptions) {
    return ui.renderDialog(type, options);
  }

  isSubscriber () {
    return data.isSubscriber();
  }

  hasDailyScore (level_key: any) {
    return data.hasDailyScore(level_key);
  }

  getCurrentDay () {
    return data.getCurrentDay();
  }

  getBrandingLogo () {
    return ui.getBrandingLogo();
  }

  getBrandingLogoUrl () {
    return ui.getBrandingLogoUrl();
  }

  startGame () {
    return ui.startGame();
  }

  endGame () {
    return ui.endGame();
  }

  showAd () {
    return ui.showAd();
  }

  getCurrentUser () {
    return data.getCurrentUser();
  }

  userLogout () {
    return data.userLogout();
  }
};
