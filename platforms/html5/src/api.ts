'use strict';

import Emitter from 'component-emitter';
import elementResizeEvent from 'element-resize-event';
import config from './config';
import session from './session';
import utils from './utils';
import data from './data';
import dialog, { DialogOptions, DialogType } from './dialog';
import messages, { ToolbarItem } from './messages';
import summary from './summary';
import { PostScoreOptions } from './data';

declare global {
  interface Window {
    SWAGTHEME: string;
  }
}

export default class SWAGAPI extends Emitter {
  protected _options: any;

  constructor (options: any) {
    super();

    this._options = options;
    this._init();
    Emitter(this);

    dialog.on('UI_EVENT', (event) => {
      this.emit(event, {type: event});
    });

    dialog.on('UI_ERROR', (event) => {
      this._emitError(event);
    });

    dialog.on('DATA_ERROR', (event) => {
      this._emitError(event);
    });

    data.on('DATA_EVENT', (event) => {
      this.emit('DATA_EVENT', {type: event});
    });

    data.on('DATA_ERROR', (event) => {
      this._emitError(event);
    });
  }

  protected _init () {
    const siteMode = this._getSiteMode();
    
    session.api_key = this._options.api_key;
    session.wrapper = this._options.wrapper;
    session.wrapper!.classList.add('swag-wrapper');
    session.theme = siteMode;
    session.provider = siteMode;

    elementResizeEvent(session.wrapper!, function() {
      setTimeout(function() {
        dialog.resize();
      }, 400);
    });
  }

  protected _getSiteMode() {
    // priority for site mode is window.SWAGTHEME, swag options theme then based on domain hosting the game
    const domainTheme = location.hostname.split('.').reverse().splice(1,1).reverse().join('.');
    const reqTheme = window.SWAGTHEME || this._options.theme || domainTheme;
    return config.themes[reqTheme]
      ? reqTheme
      : 'shockwave';
  }

  protected _emitError (errorType: string) {
    this.emit('ERROR', { type: errorType });
  }

  protected _parseUrlOptions (prop: string) {
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



  // #region API Methods

  startSession () {
    return data.getEntity()
      .then(() => {
        utils.debug('session ready');
        this.emit(config.events.SESSION_READY, { session_ready: true });
      });
  }

  toggleFullScreen () {
    return messages.trySendMessage('sw.toggleFullScreen');
  }

  navigateToArchive () {
    return messages.trySendMessage('sw.navigateToArchive');
  }

  // #endregion



  // #region Score Methods

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

  hasDailyScore (level_key: any) {
    return data.hasDailyScore(level_key);
  }

  getCurrentDay () {
    return data.getCurrentDay();
  }

  // #endregion



  // #region Achievement Methods

  getAchievementCategories () {
    return data.getAchievementCategories();
  }

  postAchievement (achievement_key: string) {
    return data.postAchievement(achievement_key);
  }

  getUserAchievements () {
    return data.getUserAchievements();
  }

  // #endregion



  // #region User Cloud Datastore Methods

  postDatastore (key: string, value: string) {
    return data.postDatastore(key, value);
  }

  getUserDatastore () {
    return data.getUserDatastore();
  }

  // #endregion



  // #region User Methods

  getCurrentEntity () {
    return session.entity;
  }

  isSubscriber () {
    return data.isSubscriber();
  }

  getCurrentUser () {
    return data.getCurrentUser();
  }

  navigateToLogin () {
    return messages.trySendMessage('sw.navigateToLogin');
  }

  userLogout () {
    return messages.trySendMessage('sw.userLogout');
  }

  // #endregion



  // #region Toolbar Management Methods

  setToolbarItems (items: Record<string, ToolbarItem>) {
    return messages.setToolbarItems(items);
  }

  updateToolbarItem (item: ToolbarItem) {
    return messages.updateToolbarItem(item);
  }

  removeToolbarItem (id: string) {
    return messages.removeToolbarItem(id);
  }

  // #endregion



  // #region UI / Dialog Methods

  showAd (type: 'video', options: {} = {}) {
    return messages.trySendMessage('sw.displayAd', JSON.stringify({ type, options }), 1000 * 60);
  }

  showShareDialog () {
    return messages.trySendMessage('sw.displayShareDialog');
  }

  showSummaryScreen (stats: Record<string, string>, resultHtml: string) {
    return summary.showSummary(stats, resultHtml);
  }

  // #endregion



  // #region Deprecated Methods

  startGame () {
    return Promise.resolve();
  }

  endGame () {
    return Promise.resolve();
  }

  showDialog (type: DialogType, options: DialogOptions) {
    return dialog.renderDialog(type, options);
  }

  populateLevelSelect (domId: any) {
    return dialog.populateLevelSelect(domId);
  }

  populateDaySelect (domId: any, limit: any) {
    return dialog.populateDaySelect(domId, limit);
  }

  populateAchievementSelect (domId: any) {
    return dialog.populateAchievementSelect(domId);
  }
  
  getBrandingLogo () {
    return dialog.getBrandingLogo();
  }

  getBrandingLogoUrl () {
    return dialog.getBrandingLogoUrl();
  }

  // #endregion
};
