import session from '@/session';
import utils from '@/utils';
import { ToolbarItem, ToolbarState } from '@/components/features/toolbar/toolbarState';
import swStampWhite from '@/assets/sw-stamp-white.svg';

// API imports
import dataApi, { PostScoreOptions } from '@/api/data';
import loaderUi from '@/api/loaderUi';
import messagesApi from '@/api/messages';
import summaryScreenUi from '@/api/summaryScreenUi';
import toolbarUi from '@/api/toolbarUi';
import splashScreenUi from '@/api/splashScreenUi';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
import drupalApi from '@/api/drupal';
// import abandonDailyGameApi from '@/api/abandonDailyGame';
import globalEventHandler, { GlobalEventType } from '@/api/globalEventHandler';

export interface SWAGAPIOptions {
  apiKey: string;
  debug?: boolean;
  gameTitle?: string;
  analytics?: {
    gameId?: string,
  },
  leaderboards?: {
    dailyScoreLevelKey?: string;
  },
  leaderboardScreen?: true | {
  },
  // onAbandonDailyGame?: () => Record<string, any>,
  splashScreen?: true | {
    showOnLoad?: boolean,
    containerElementId?: string;
    isBeta?: boolean;
  },
  summaryScreen?: {
    containerElementId?: string;
  },
  toolbar?: true | {
    containerElementId?: string;
    initialToolbarState?: ToolbarState;
    titleIcon?: string;
    titleIconDark?: string;
  },
}

function sessionReadyError () {
  return new Error('Session not ready. Please call startSession() and wait for the promise to resolve or listen for the SESSION_READY event before using this method.');
}

export default class SWAGAPI {
  private options: SWAGAPIOptions;
  private ready = false;

  constructor (options: SWAGAPIOptions) {
    this.options = options;
    this.init();
  }

  private async init () {
    /* 
     * Session setup
     */

    session.apiKey = this.options.apiKey || null;
    session.debug = !!this.options.debug;
    session.gameTitle = this.options.gameTitle || '';
    session.analyticsId = this.options.analytics?.gameId || null;

    // // Abandon daily game setup

    // if (this.options.onAbandonDailyGame) {
    //   abandonDailyGameApi.queueEvent(this.options.onAbandonDailyGame);
    // }

    /*
     * Leaderboard setup
     */

    const dailyScoreLevelKey = this.options.leaderboards?.dailyScoreLevelKey || 'daily';

    // Leaderboard screen setup

    leaderboardScreenUi.setLevelKey(dailyScoreLevelKey);

    /* 
     * Splash screen setup
     */

    if (typeof this.options.splashScreen === 'object') {
      if (this.options.splashScreen?.containerElementId) {
        splashScreenUi.setRootElId(this.options.splashScreen.containerElementId);
      }
    }

    /*
     * Summary screen setup
     */

    if (this.options.summaryScreen?.containerElementId) {
      summaryScreenUi.setRootElId(this.options.summaryScreen.containerElementId);
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
    } 
    
    // No toolbar enabled, tell website to show its own
    else {
      messagesApi.trySendMessage('swag.toolbar.show', '', true);
    }
  }



  // #region API Methods

  async startSession () {
    if (this.ready) {
      throw new Error('Cannot start session; session already started.');
    }

    /*
     * Initial setup
     */

    // Theme
    const theme = this.getPlatformTheme();
    if (theme === 'dark') document.body.classList.add('swag-theme--dark');

    // Game info
    const game = await dataApi.getGame(); 
    try {
      await drupalApi.getGame(session.game!.shockwave_keyword);
    } catch {
      session.game = { 
        ...(session.game!),
        hex_color: '#3377cc',
        icon_url: swStampWhite,
      };
    }

    if (!this.options.gameTitle && game) {
      session.gameTitle = game.name;
    }

    // Game CSS Variables
    document.documentElement.style.setProperty('--swag-l-game-accent-color', session.game!.hex_color);

    /*
     * User session
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
    let entity;
    try {
      entity = await dataApi.getEntity();
    } catch (error) {
      utils.error('Error fetching entity', error);
    }

    // Have the user join a leaderboard if the code is present in the URL
    const roomCode = utils.parseUrlOptions('leaderboard') as string;
    if (
      roomCode && 
      session.entity && 
      !session.entity.leaderboards.includes(roomCode)
    ) {
      try {
        await dataApi.postUserLeaderboardJoin(roomCode);
        session.entity.leaderboards.push(roomCode);
      } catch (e) {
        utils.error('Error joining leaderboard with code', roomCode, e);
      }
    }

    /*
     * UI setup
     */

    // Set OS theme color
    if (theme === 'dark') {
      utils.setOsThemeColor('#1f1f1f');
    } else {
      if (session.game?.hex_color) {
        utils.setOsThemeColor(session.game?.hex_color);
      }
    }

    // Splash screen
    if (this.options.splashScreen) {
      const opts = typeof this.options.splashScreen === 'object' 
        ? this.options.splashScreen 
        : {};
      if (opts.showOnLoad) {
        document.body.classList.add('swag-splashScreen--open'); // hide toolbar
        splashScreenUi.show({
          isBeta: opts.isBeta || false,
          hasLeaderboard: !!this.options.leaderboardScreen,
        });
      }
    }

    // Toolbar
    if (this.options.toolbar) {
      this.showToolbar();
    }

    /*
     * Ready
     */

    this.ready = true;
    utils.log('Session ready for user', entity?._id, 'on', utils.getPlatform(), 'platform');
    globalEventHandler.dispatchEvent(new CustomEvent(GlobalEventType.SESSION_READY, { detail: { session_ready: true } }));
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



  // #region Game Methods

  getGame () {
    return dataApi.getGame();
  }

  // #endregion



  // #region Daily Game Methods

  async startDailyGame (day: string, properties: Record<string, any> = {}) {
    if (!this.ready) throw sessionReadyError();

    const result = await dataApi.postDailyGameProgress(day, false, properties);
    messagesApi.trySendMessage('swag.dailyGameProgress.start', day, true);
    return result;
  }

  async completeDailyGame (day: string, properties: Record<string, any> = {}) {
    if (!this.ready) throw sessionReadyError();
    
    // abandonDailyGameApi.emptyQueue();
    const result = await dataApi.postDailyGameProgress(day, true, properties);
    messagesApi.trySendMessage('swag.dailyGameProgress.complete', day, true);
    return result;
  }

  getCurrentDay () {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getCurrentDay();
  }

  getGameProgress (month: string, year: string) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getDailyGameProgress(month, year);
  }
  
  getGameStreak () {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getDailyGameStreak();
  }

  hasPlayedDay (day: string) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.hasPlayedDay(day);
  }
 
  // #endregion


  
  // #region Score Methods

  getScoreCategories () {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getScoreCategories();
  }

  getDays (limit: number) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getDays(limit);
  }

  getScores (options: PostScoreOptions) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getScores(options);
  }

  postScore (levelKey: string, value: string, options: PostScoreOptions) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.postScore(levelKey, value, options);
  }

  postDailyScore (value: string) {
    if (!this.ready) throw sessionReadyError();
    
    const day = utils.getDateString();
    const levelKey = this.options?.leaderboards?.dailyScoreLevelKey || 'daily';

    return dataApi.postDailyScore(day, levelKey, value);
  }

  hasDailyScore (levelKey: any) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.hasDailyScore(levelKey);
  }

  // #endregion



  // #region Achievement Methods

  getAchievementCategories () {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getAchievementCategories();
  }

  postAchievement (achievement_key: string) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.postAchievement(achievement_key);
  }

  getUserAchievements () {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.getUserAchievements();
  }

  // #endregion



  // #region User Methods

  getCurrentEntity () {
    if (!this.ready) throw sessionReadyError();
    
    return session.entity;
  }

  isSubscriber () {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.isSubscriber();
  }

  setUserData (key: string, value: string) {
    if (!this.ready) throw sessionReadyError();
    
    return dataApi.postDatastore(key, value);
  }

  getUserData () {
    if (!this.ready) throw sessionReadyError();
    
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

  private async showToolbar () {
    const toolbarOptions = this.options.toolbar === true 
      ? {} 
      : this.options.toolbar;

    // tell website to hide its toolbar if it has one
    messagesApi.trySendMessage('swag.toolbar.hide', '', true);

    toolbarUi.show({ 
      ...toolbarOptions,
    });
  }

  setToolbarItems (items: ToolbarItem[]) {
    if (!this.ready) throw sessionReadyError();
    
    toolbarUi.setItems(items);
  }

  updateToolbarItem (item: ToolbarItem) {
    if (!this.ready) throw sessionReadyError();
    
    toolbarUi.updateItem(item);
  }

  removeToolbarItem (id: string) {
    if (!this.ready) throw sessionReadyError();
    
    toolbarUi.removeItem(id);
  }

  // #endregion



  // #region UI

  showSplashScreen (options: {
    isBeta?: boolean,
    onClickPlay?: () => void,
  } = {}) {
    if (!this.ready) throw sessionReadyError();
    
    const opts = {
      ...(
        typeof this.options.splashScreen === 'object' 
          ? this.options.splashScreen 
          : {}
      ),
      ...options,
    };

    return splashScreenUi.show({
      isBeta: opts.isBeta || false,
      onClickPlay: opts.onClickPlay,
      hasLeaderboard: !!this.options.leaderboardScreen,
    });
  }

  showSummaryScreen (options: {
    stats: { key: string, value: string, lottie: object }[], 
    contentHtml: string, 
    shareString: string, 
    onFavorite?: () => void,
    onReplay?: () => void,
    onClose?: () => void,
  }) {
    if (!this.ready) throw sessionReadyError();
    
    return summaryScreenUi.show({
      ...options,
      hasLeaderboard: !!this.options.leaderboardScreen,
    });
  }

  showLoader (debounce?: number) {
    return loaderUi.show(debounce);
  }

  hideLoader () {
    return loaderUi.hide();
  }

  // #endregion



  // #region Platform Methods

  getPlatform () {
    return utils.getPlatform();
  }

  getPlatformTheme (): ('light' | 'dark') {
    return utils.getPlatformTheme();
  }

  // #endregion



  // #region Global Events

  on (type: GlobalEventType, listener: EventListenerOrEventListenerObject) {
    globalEventHandler.addEventListener(type, listener);
  }

  off (type: GlobalEventType, listener: EventListenerOrEventListenerObject) {
    globalEventHandler.removeEventListener(type, listener);
  }

  // #endregion
  


}
