'use strict';

import session from '@/session';
import utils from '@/utils';
import { ToolbarItem, ToolbarState } from '@/components/features/toolbar/toolbarState';

// API imports
import dataApi, { PostScoreOptions } from '@/api/data';
import loaderUi from '@/api/loaderUi';
import messagesApi from '@/api/messages';
import summaryScreenUi from '@/api/summaryScreenUi';
import toolbarUi from '@/api/toolbarUi';

export interface SWAGAPIOptions {
  apiKey: string;
  gameTitle: string;
  debug?: boolean;
  summary?: {
    containerElementId?: string;
  },
  toolbar?: true | {
    containerElementId?: string;
    onClickFullScreen?: () => void;
    titleIcon?: string;
    titleIconDark?: string;
    initialToolbarState?: ToolbarState;
  },
}

export default class SWAGAPI {
  protected options: SWAGAPIOptions;

  constructor (options: SWAGAPIOptions) {
    this.options = options;

    // data.on('DATA_EVENT', (event) => {
    //   this.emit('DATA_EVENT', { type: event });
    // });

    // data.on('DATA_ERROR', (event) => {
    //   this._emitError(event);
    // });

    this.init();
  }

  protected init () {
    /* 
     * Session setup
     */

    session.apiKey = this.options.apiKey || null;
    session.debug = !!this.options.debug;

    /*
     * Summary screen setup
     */

    if (this.options.summary?.containerElementId) {
      summaryScreenUi.setRootElId(this.options.summary.containerElementId);
    }

    /*
     * Toolbar setup
     */

    // Use the toolbar if configured
    if (this.options.toolbar) {
      const toolbarOptions = this.options.toolbar === true 
        ? {} 
        : this.options.toolbar;

      // custom root element
      if (toolbarOptions.containerElementId) {
        toolbarUi.setRootElId(toolbarOptions.containerElementId);
      }

      this.showToolbar();
    } 
    
    // No toolbar enabled, tell website to show its own
    else {
      messagesApi.trySendMessage('swag.toolbar.show', '', true);
    }
  }



  // #region API Methods

  async startSession () {
    /*
     * Theme
     */

    const theme = this.getPlatformTheme();
    if (theme === 'dark') document.body.classList.add('swag-theme--dark');

    /*
     * Session
     */
    
    const passedInToken = utils.parseUrlOptions('jwt') as string;

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

    // Fetch the current user
    const entity = await dataApi.getEntity();

    /*
     * Ready
     */

    utils.log('Session Ready for user', entity?._id, 'on', utils.getPlatform(), 'platform');
  }

  toggleFullScreen () {
    return messagesApi.trySendMessage('swag.toggleFullScreen');
  }

  navigateToArchive () {
    return messagesApi.trySendMessage('swag.navigateToArchive');
  }

  navigateToTitle (keyword: string) {
    return messagesApi.trySendMessage('swag.navigateToTitle', keyword);
  }

  // #endregion



  // #region Daily Game Methods

  async startDailyGame (day: string) {
    const result = await dataApi.postDailyGameProgress(day, false);
    messagesApi.trySendMessage('swag.dailyGameProgress.start', day, true);
    return result;
  }

  async completeDailyGame (day: string) {
    const result = await dataApi.postDailyGameProgress(day, true);
    messagesApi.trySendMessage('swag.dailyGameProgress.complete', day, true);
    return result;
  }

  getCurrentDay () {
    return dataApi.getCurrentDay();
  }

  getGameProgress (month: string, year: string) {
    return dataApi.getDailyGameProgress(month, year);
  }
  
  getGameStreak () {
    return dataApi.getDailyGameStreak();
  }

  hasPlayedDay (day: string) {
    return dataApi.hasPlayedDay(day);
  }
 
  // #endregion


  
  // #region Score Methods

  getScoreCategories () {
    return dataApi.getScoreCategories();
  }

  getDays (limit: number) {
    return dataApi.getDays(limit);
  }

  getScores (options: PostScoreOptions) {
    return dataApi.getScores(options);
  }

  postScore (level_key: string, value: string, options: PostScoreOptions) {
    return dataApi.postScore(level_key, value, options)
      .then(function () {
        if(options && options.confirmation === true) {
          alert(`Your score of ${value} has been submitted!`);
        }
      });
  }

  postDailyScore (day: string, level_key: string, value: string) {
    return dataApi.postDailyScore(day, level_key, value);
  }

  hasDailyScore (level_key: any) {
    return dataApi.hasDailyScore(level_key);
  }

  // #endregion



  // #region Achievement Methods

  getAchievementCategories () {
    return dataApi.getAchievementCategories();
  }

  postAchievement (achievement_key: string) {
    return dataApi.postAchievement(achievement_key);
  }

  getUserAchievements () {
    return dataApi.getUserAchievements();
  }

  // #endregion



  // #region User Methods

  getCurrentEntity () {
    return session.entity;
  }

  isSubscriber () {
    return dataApi.isSubscriber();
  }

  setUserData (key: string, value: string) {
    return dataApi.postDatastore(key, value);
  }

  getUserData () {
    return dataApi.getUserDatastore();
  }

  setLocalUserData (key: string, value: string | null) {
    if (value === null) {
      return localStorage.removeItem(`swag:userData:${key}`);
    }
    localStorage.setItem(`swag:userData:${key}`, value);
  }

  getLocalUserData (key: string) {
    return localStorage.getItem(`swag:userData:${key}`);
  }

  // #endregion



  // #region Toolbar Management Methods

  async showToolbar () {
    const toolbarOptions = this.options.toolbar === true 
      ? {} 
      : this.options.toolbar;

    // tell website to hide its toolbar if it has one
    messagesApi.trySendMessage('swag.toolbar.hide', '', true);

    let title = this.options.gameTitle || '';
    
    if (!this.options.gameTitle) {
      const game = await dataApi.getGame();
      if (game && game.name) title = game.name;
    }

    toolbarUi.show({ 
      ...toolbarOptions,
      title,
    });
  }

  hideToolbar () {
    toolbarUi.hide();
  }

  setToolbarItems (items: ToolbarItem[]) {
    toolbarUi.setItems(items);
  }

  updateToolbarItem (item: ToolbarItem) {
    toolbarUi.updateItem(item);
  }

  removeToolbarItem (id: string) {
    toolbarUi.removeItem(id);
  }

  // #endregion



  // #region UI

  async showSplashScreen () {
    throw new Error('Not implemented');
  }

  async showSummaryScreen (
    options: {
      stats: { key: string, value: string, lottie: object }[], 
      contentHtml: string, 
      shareString: string, 
      onFavorite?: () => void,
      onReplay?: () => void,
      onClose?: () => void,
    }
  ) {
    return summaryScreenUi.show(
      options.stats, 
      options.contentHtml,
      options.shareString,
      options?.onFavorite,
      options?.onReplay,
      options?.onClose,
    );
  }

  showLoader (debounce?: number) {
    return loaderUi.show(debounce);
  }

  hideLoader () {
    return loaderUi.hide();
  }

  // #endregion



  // #region Platform Interface Methods

  getPlatform () {
    return utils.getPlatform();
  }

  getPlatformTheme (): ('light' | 'dark') {
    return utils.getPlatformTheme();
  }

  // #endregion

}
