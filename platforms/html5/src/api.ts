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

export default class SWAGAPI extends Emitter {
  protected _options: any;

  constructor (options: any) {
    super();
    Emitter(this);

    this._options = options;
    this._init();

    dialog.on('UI_EVENT', (event) => {
      this.emit(event, { type: event });
    });

    dialog.on('UI_ERROR', (event) => {
      this._emitError(event);
    });

    dialog.on('DATA_ERROR', (event) => {
      this._emitError(event);
    });

    data.on('DATA_EVENT', (event) => {
      this.emit('DATA_EVENT', { type: event });
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

    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', 'swag-react-root');
    session.wrapper!.appendChild(reactRoot);
    
    messages.trySendMessage('swag.toolbar.show', '', true);

    elementResizeEvent(session.wrapper!, function () {
      setTimeout(function () {
        dialog.resize();
      }, 400);
    });
  }

  protected _getSiteMode () {
    // priority for site mode is window.SWAGTHEME, swag options theme then based on domain hosting the game
    const domainTheme = location.hostname.split('.').reverse().splice(1,1).reverse().join('.');
    const reqTheme = window.SWAGTHEME || this._options.theme || domainTheme;
    return config.themes[ reqTheme ]
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
    definitions.forEach( function (val) {
      const parts = val.split( '=', 2 );
      params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
  }



  // #region API Methods

  async startSession () {
    const passedInToken = this._parseUrlOptions('jwt') as string;

    // External token provided in the URL
    if (typeof passedInToken === 'string' && passedInToken.length > 0) {
      session.jwt = passedInToken;
    } 
    // Local storage for standalone sites
    else if (utils.getPlatform() === 'standalone') {
      const storedToken = localStorage.getItem('swag_token');
      if (typeof storedToken === 'string' && storedToken.length > 0) {
        session.jwt = storedToken;
      }
    } 
    // Embeded, will get user from member ID in cookie
    else {
      session.jwt = null;
      localStorage.removeItem('swag_token');
    }

    // Theme
    const theme = this.getPlatformTheme();
    if (theme === 'dark') document.body.classList.add('swag-theme--dark');

    // Fetch the current user
    const entity = await data.getEntity();

    // Ready
    // eslint-disable-next-line no-console
    console.log('Session Ready for user', entity?._id, 'on', utils.getPlatform(), 'platform');
    utils.debug('session ready');
    this.emit(config.events.SESSION_READY, { session_ready: true });
  }

  toggleFullScreen () {
    return messages.trySendMessage('swag.toggleFullScreen');
  }

  navigateToArchive () {
    return messages.trySendMessage('swag.navigateToArchive');
  }

  navigateToGameLanding () {
    return messages.trySendMessage('swag.navigateToGameLanding');
  }

  navigateToTitle (slug: string) {
    return messages.trySendMessage('swag.navigateToTitle', slug);
  }

  captureEvent (event: string, params: any) {
    const payload = JSON.stringify({ event, params });
    return messages.trySendMessage('swag.captureEvent', payload, true);
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
      .then(function () {
        if(options && options.confirmation === true) {
          alert(`Your score of ${value} has been submitted!`);
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



  // #region Daily Game Methods

  async startDailyGame (day: string) {
    const result = await data.postDailyGameProgress(day, false);
    messages.trySendMessage('swag.dailyGameProgress.start', day, true);
    return result;
  }

  async completeDailyGame (day: string) {
    const result = await data.postDailyGameProgress(day, true);
    messages.trySendMessage('swag.dailyGameProgress.complete', day, true);
    return result;
  }

  getDailyGameProgress (month: string, year: string) {
    return data.getDailyGameProgress(month, year);
  }

  hasPlayedDay (day: string) {
    return data.hasPlayedDay(day);
  }
  
  getDailyGameStreak () {
    return data.getDailyGameStreak();
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
    // eslint-disable-next-line no-console
    console.warn('getCurrentUser is deprecated, use getCurrentEntity instead');
    return data.getCurrentUser();
  }

  navigateToLogin () {
    return messages.trySendMessage('swag.navigateToLogin');
  }

  userLogout () {
    return messages.trySendMessage('swag.userLogout');
  }

  // #endregion



  // #region Toolbar Management Methods

  setToolbarItems (items: ToolbarItem[]) {
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

  showShareDialog () {
    return messages.trySendMessage('swag.displayShareDialog');
  }

  async showSummaryScreen (
    options: {
      stats: { key: string, value: string }[], 
      titleHtml: string, 
      resultHtml: string, 
      shareString: string, 
      onReplay?: () => void,
      onClose?: () => void
    }
  ) {
    return summary.showSummary(
      options.stats, 
      options.resultHtml, 
      options.shareString,
      options?.titleHtml,
      options?.onReplay,
      options?.onClose
    );
  }

  // #endregion



  // #region Platform Interface Methods

  getPlatform () {
    return utils.getPlatform();
  }

  getPlatformTheme (): ('light' | 'dark') {
    if (this._parseUrlOptions('theme')) {
      return this._parseUrlOptions('theme') === 'dark' 
        ? 'dark' : 'light';
    }
    else if (this.getPlatform() === 'standalone') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemTheme ? 'dark' : 'light';
    }
    return 'light';
  }

  // #endregion



  // #region WIP Methods

  startGame () {
    return Promise.resolve();
  }

  endGame () {
    return Promise.resolve();
  }

  showAd () {
    return Promise.resolve();
  }

  // #endregion



  // #region Legacy Dialog Methods

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
}
