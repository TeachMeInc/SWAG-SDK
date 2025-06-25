'use strict';

import Emitter from 'component-emitter';
import elementResizeEvent from 'element-resize-event';
import config from './config';
import session from './session';
import utils from './utils';
import data from './data';
import dialog, { DialogOptions, DialogType } from './dialog';
import messages from './messages';
import summary from './summary';
import { PostScoreOptions } from './data';
import toolbar, { ToolbarItem } from './toolbar';

export interface SWAGAPIOptions {
  apiKey: string;
  gameTitle: string;
  wrapper: HTMLElement;
  summary?: {
    wrapperId?: string;
  },
  toolbar?: {
    wrapperId?: string;
    onClickFullScreen?: () => void;
    titleIcon?: string;
    titleIconDark?: string;
  },
  // Deprecated
  theme?: 'shockwave';
  api_key?: string;
}

export default class SWAGAPI extends Emitter {
  protected _options: SWAGAPIOptions;

  constructor (options: SWAGAPIOptions) {
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

  protected _createPreactRoot (id: string) {
    const root = document.createElement('div');
    root.setAttribute('id', id);
    session.wrapper!.appendChild(root);
  }

  protected _init () {
    // Configuration setup
    const siteMode = this._getSiteMode();

    session.api_key = this._options.apiKey || this._options.api_key || null;
    session.wrapper = this._options.wrapper;
    session.wrapper!.classList.add('swag-wrapper');
    session.theme = siteMode;
    session.provider = siteMode;

    // Summary screen setup
    if (!this._options.summary?.wrapperId) this._createPreactRoot('swag-summary-root');
    else summary.rootElId = this._options.summary.wrapperId;

    // Toolbar setup
    if (this._options.toolbar) {
      messages.trySendMessage('swag.toolbar.hide', '', true);

      if (!this._options.toolbar.wrapperId) this._createPreactRoot('swag-toolbar-root');
      else toolbar.rootElId = this._options.toolbar.wrapperId;

      (async () => {
        let title = this._options.gameTitle;

        if (!title) {
          const game = await data.getGame();
          if (game && game.name) title = game.name;
          else title = '';
        }

        toolbar.showToolbar({ 
          ...this._options.toolbar,
          title,
          useCustomRootEl: !!this._options.toolbar?.wrapperId,
        });
      })();
    } else {
      messages.trySendMessage('swag.toolbar.show', '', true);
    }

    // Dialog setup (legacy)
    elementResizeEvent(session.wrapper!, function () {
      setTimeout(function () {
        dialog.resize();
      }, 400);
    });
  }

  protected _getSiteMode (): 'shockwave' {
    return 'shockwave';
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
    toolbar.setItems(items);
  }

  updateToolbarItem (item: ToolbarItem) {
    toolbar.updateItem(item);
  }

  removeToolbarItem (id: string) {
    toolbar.removeItem(id);
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
