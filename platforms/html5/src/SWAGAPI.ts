'use strict';

import session from '@/session';
import utils from '@/utils';
import messages from '@/api/messages';
import summary from '@/api/summaryScreenUi';
import data from '@/api/data';
import { loaderUi } from '@/api/loaderUi';
import { ToolbarItem, ToolbarState } from '@/components/features/toolbar/toolbarState';
import toolbar from '@/api/toolbarUi';

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

    const siteMode = 'shockwave';
    session.apiKey = this.options.apiKey || null;
    session.theme = siteMode;
    session.provider = siteMode;

    /*
     * Summary screen setup
     */

    if (this.options.summary?.containerElementId) {
      summary.setRootElId(this.options.summary.containerElementId);
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
        toolbar.setRootElId(toolbarOptions.containerElementId);
      }

      this.showToolbar();
    } 
    
    // No toolbar enabled, tell website to show its own
    else {
      messages.trySendMessage('swag.toolbar.show', '', true);
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
    const entity = await data.getEntity();

    /*
     * Ready
     */

    utils.log('Session Ready for user', entity?._id, 'on', utils.getPlatform(), 'platform');
  }

  toggleFullScreen () {
    return messages.trySendMessage('swag.toggleFullScreen');
  }

  navigateToArchive () {
    return messages.trySendMessage('swag.navigateToArchive');
  }

  navigateToTitle (keyword: string) {
    return messages.trySendMessage('swag.navigateToTitle', keyword);
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

  getCurrentDay () {
    return data.getCurrentDay();
  }

  getGameProgress (month: string, year: string) {
    return data.getDailyGameProgress(month, year);
  }
  
  getGameStreak () {
    return data.getDailyGameStreak();
  }

  hasPlayedDay (day: string) {
    return data.hasPlayedDay(day);
  }
 
  // #endregion



  // #region User Cloud Datastore Methods

  // setUserData (key: string, value: string) {
  //   return data.postDatastore(key, value);
  // }

  // getUserData () {
  //   return data.getUserDatastore();
  // }

  // #endregion



  // #region User Methods

  getCurrentEntity () {
    return session.entity;
  }

  isSubscriber () {
    return data.isSubscriber();
  }

  // #endregion



  // #region Toolbar Management Methods

  async showToolbar () {
    const toolbarOptions = this.options.toolbar === true 
      ? {} 
      : this.options.toolbar;

    // tell website to hide its toolbar if it has one
    messages.trySendMessage('swag.toolbar.hide', '', true);

    let title = this.options.gameTitle || '';
    
    if (!this.options.gameTitle) {
      const game = await data.getGame();
      if (game && game.name) title = game.name;
    }

    toolbar.show({ 
      ...toolbarOptions,
      title,
    });
  }

  hideToolbar () {
    toolbar.hide();
  }

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
    return summary.show(
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
