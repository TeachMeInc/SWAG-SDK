declare class APIWrapper {
  getInstance(options: any, onReady?: (instance: SWAGAPI) => {}): SWAGAPI;
  getInstanceAsync(options: any): Promise<SWAGAPI>;
  showBrandingAnimation(element: string, callback: () => {}): Promise<void>;
  showLeaderboard(): Promise<void>;
}

declare interface DailyGameProgress {
  day: string;
  state: string;
}

declare interface DailyGameStreak {
  streak: number;
}

declare interface DialogOptions {
  theme?: string;
  title?: string;
  level_key?: string;
  period?: string;
  header?: {
    backButton: boolean;
  };
}

declare type DialogType = 'scores' | 'dailyscores' | 'scoreconfirmation' | 'achievements' | 'weeklyscores' | 'userlogin' | 'usercreate';

declare type Emitter = {
  on(event: string, listener: (...arguments_: any[]) => void): Emitter;
  once(event: string, listener: (...arguments_: any[]) => void): Emitter;
  off(event: string, listener: (...arguments_: any[]) => void): Emitter;
  off(): Emitter;
  emit(event: string, ...arguments_: any[]): Emitter;
  listeners(event: string): Array<(...arguments_: any[]) => void>;
  listenerCount(event: string): number;
  listenerCount(): number;
  hasListeners(): boolean;
};

declare const emitter: EmitterConstructor;

declare type EmitterConstructor = {
  prototype: Emitter;
  new (object?: object): Emitter;
  <T extends object>(object: T): T & Emitter;
};

declare interface GameModeData {
  game: string;
  name: string;
  level_key: string;
  value_type: 'time' | 'score';
  value_name: string;
  reverse: boolean;
  order: number;
}

declare interface LeaderboardData {
  level_key: string;
  value: string;
  date_created: string;
  screen_name: string;
  avatarUrl: string;
}

declare type MessageEventName = 'swag.toolbar.setItems' | 'swag.toolbar.updateItem' | 'swag.toolbar.removeItem' | 'swag.toolbar.click' | 'swag.toggleFullScreen' | 'swag.navigateToArchive' | 'swag.navigateToGameLanding' | 'swag.navigateToLogin' | 'swag.navigateToTitle' | 'swag.displayAd' | 'swag.displayShareDialog' | 'swag.userLogout' | 'swag.getRelatedGames';

declare interface MessagePayload {
  eventName: MessageEventName;
  message: string;
}

declare interface PostScoreOptions {
  day?: string;
  type?: string;
  level_key?: string;
  period?: string;
  current_user?: string;
  target_date?: string;
  value_formatter?: string;
  use_daily?: boolean;
  confirmation?: boolean;
  meta?: any;
}

declare class SWAGAPI extends emitter {
  protected _options: any;
  constructor(options: any);
  protected _init(): void;
  protected _getSiteMode(): any;
  protected _emitError(errorType: string): void;
  protected _parseUrlOptions(prop: string): string | Record<string, string>;
  startSession(): Promise<void>;
  toggleFullScreen(): Promise<MessagePayload>;
  navigateToArchive(): Promise<MessagePayload>;
  navigateToGameLanding(): Promise<MessagePayload>;
  navigateToTitle(slug: string): Promise<MessagePayload>;
  getScoreCategories(): Promise<GameModeData[]>;
  getDays(limit: number): Promise<any[]>;
  getScores(options: PostScoreOptions): Promise<LeaderboardData[]>;
  postScore(level_key: string, value: string, options: PostScoreOptions): Promise<void>;
  postDailyScore(day: string, level_key: string, value: string): Promise<unknown>;
  hasDailyScore(level_key: any): Promise<unknown>;
  getCurrentDay(): Promise<{
    day: string;
  }>;
  startDailyGame(day: string): Promise<unknown>;
  completeDailyGame(day: string): Promise<unknown>;
  getDailyGameProgress(month: string, year: string): Promise<DailyGameProgress[]>;
  hasPlayedDay(day: string): Promise<boolean>;
  getDailyGameStreak(): Promise<DailyGameStreak>;
  getAchievementCategories(): Promise<any[]>;
  postAchievement(achievement_key: string): Promise<unknown>;
  getUserAchievements(): Promise<any[]>;
  postDatastore(key: string, value: string): Promise<unknown>;
  getUserDatastore(): Promise<unknown>;
  getCurrentEntity(): string | null;
  isSubscriber(): Promise<boolean>;
  getCurrentUser(): Promise<unknown>;
  navigateToLogin(): Promise<MessagePayload>;
  userLogout(): Promise<MessagePayload>;
  setToolbarItems(items: ToolbarItem[]): Promise<MessagePayload>;
  updateToolbarItem(item: ToolbarItem): Promise<MessagePayload>;
  removeToolbarItem(id: string): Promise<MessagePayload>;
  showShareDialog(): Promise<MessagePayload>;
  showSummaryScreen(options: {
    stats: {
      key: string;
      value: string;
    }[], 
    resultHtml: string, 
    shareString: string, 
    titleHtml?: string, 
    onReplay?: () => void
    onClose?: () => void
  }): Promise<void>;
  startGame(): Promise<void>;
  endGame(): Promise<void>;
  showAd(): Promise<void>;
  showDialog(type: DialogType, options: DialogOptions): void;
  populateLevelSelect(domId: any): Promise<void>;
  populateDaySelect(domId: any, limit: any): Promise<void>;
  populateAchievementSelect(domId: any): Promise<void>;
  getBrandingLogo(): Promise<HTMLImageElement>;
  getBrandingLogoUrl(): Promise<string>;
  getPlatform(): ('embed' | 'app' | 'standalone');
  getPlatformTheme(): ('light' | 'dark');
  getExternalToken(): string;
  generateGuestToken(): Promise<string>;
}

declare interface ToolbarItem {
  id: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export {};

declare global {
  interface Window {
    SWAGTHEME: string;
    SWAGAPI: APIWrapper;
  }
}
