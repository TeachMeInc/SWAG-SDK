'use strict';

import session from '@/session';
import utils from '@/utils';
import messages from '@/api/messages/messages';
import summary from '@/api/summaryScreen/summaryScreenUi';
import data from '@/api/data/data';
import { loaderUi } from '@/api/loader/loaderUi';
import { ToolbarItem, ToolbarState } from '@/api/toolbar/toolbarState';
import toolbar from '@/api/toolbar/toolbarUi';

export interface SWAGAPIOptions {
  apiKey: string;
  gameTitle: string;
  debug?: boolean;
  summary?: {
    containerElementId?: string;
  },
  toolbar?: {
    containerElementId?: string;
    onClickFullScreen?: () => void;
    titleIcon?: string;
    titleIconDark?: string;
    initialToolbarState?: ToolbarState;
  },
}

export default class SWAGAPI {
  protected _options: SWAGAPIOptions;

  constructor (options: SWAGAPIOptions) {
    this._options = options;

    // data.on('DATA_EVENT', (event) => {
    //   this.emit('DATA_EVENT', { type: event });
    // });

    // data.on('DATA_ERROR', (event) => {
    //   this._emitError(event);
    // });

    this._init();
  }

  protected _init () {
    // Configuration setup
    const siteMode = 'shockwave';

    session.api_key = this._options.apiKey || null;
    session.theme = siteMode;
    session.provider = siteMode;

    // Summary screen setup
    if (this._options.summary?.containerElementId) {
      summary.setRootElId(this._options.summary.containerElementId);
    }

    // Toolbar setup
    if (this._options.toolbar) {
      messages.trySendMessage('swag.toolbar.hide', '', true);

      if (this._options.toolbar.containerElementId) {
        toolbar.setRootElId(this._options.toolbar.containerElementId);
      }

      (async () => {
        toolbar.show({ 
          ...this._options.toolbar,
          title: this._options.gameTitle || '',
          useCustomRootEl: !!this._options.toolbar?.containerElementId,
        });
        
        if (!this._options.gameTitle) {
          const game = await data.getGame();
          if (game && game.name) {
            toolbar.showToolbar({
              title: game.name,
            });
          }
        }
      })();
    } else {
      messages.trySendMessage('swag.toolbar.show', '', true);
    }
  }



  // #region API Methods

  async startSession () {
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

    // Theme
    const theme = this.getPlatformTheme();
    if (theme === 'dark') document.body.classList.add('swag-theme--dark');

    // Fetch the current user
    const entity = await data.getEntity();

    // Ready
    const ready = () => {
      // eslint-disable-next-line no-console
      console.log('Session Ready for user', entity?._id, 'on', utils.getPlatform(), 'platform');
      utils.debug('session ready');
      // this.emit(config.events.SESSION_READY, { session_ready: true });
    };

    // Wait for toolbar to be ready
    if (this._options.toolbar) {
      const interval = setInterval(() => {
        const toolbarEl = document.getElementById(toolbar.getRootElId());
        if (toolbarEl) {
          clearInterval(interval);
          ready();
        }
      }, 10);
    } else {
      ready();
    }
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

  async startGame (day: string) {
    const result = await data.postDailyGameProgress(day, false);
    messages.trySendMessage('swag.dailyGameProgress.start', day, true);
    return result;
  }

  async completeGame (day: string) {
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
