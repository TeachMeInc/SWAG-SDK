/* eslint-disable */
// Type definitions for SWAG HTML5 SDK v5.4.6
// Visit https://developers.shockwave.com for more information

interface Entity {
    _id: string;
    token: string;
    member?: {
        shockwave?: {
            screen_name: string;
            site_member_id: number;
            source: string;
            shockwave_logged_in: number;
        };
    };
    leaderboard_name: string;
    leaderboards: string[];
}

interface Game {
    name: string;
    archive_background_color: string;
    archive_icon: string;
    shockwave_keyword: string;
}

interface LeaderboardData {
    level_key: string;
    value: string;
    date_created: string;
    screen_name: string;
    leaderboard_name?: string;
    avatarUrl: string;
}
interface GameModeData {
    game: string;
    name: string;
    level_key: string;
    value_type: 'time' | 'score';
    value_name: string;
    reverse: boolean;
    order: number;
}
interface DailyGameProgress {
    day: string;
    state: string;
}
interface DailyGameStreak {
    streak: number;
    maxStreak: number;
}
interface PostScoreOptions {
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
    leaderboard?: string;
}

type MessageEventName = 'noop' | 'swag.toolbar.show' | 'swag.toolbar.hide' | 'swag.toggleFullScreen' | 'swag.navigateToArchive' | 'swag.navigateToGameLanding' | 'swag.navigateToTitle' | 'swag.navigateToHome' | 'swag.dailyGameProgress.start' | 'swag.dailyGameProgress.complete' | 'swag.setLeaderboardCode' | 'swag.requestHostUrl';
interface MessagePayload {
    eventName: MessageEventName;
    message: string;
}

interface ToolbarItem {
    id: string;
    label?: string;
    icon?: string;
    disabled?: boolean;
    toggled?: boolean;
    onClick?: () => void;
}
interface ToolbarState {
    items: ToolbarItem[];
}

declare enum GlobalEventType {
    API_COMMUNICATION_ERROR = "API_COMMUNICATION_ERROR",
    ERROR = "ERROR",
    SESSION_READY = "SESSION_READY",
    SPLASH_SCREEN_CLICK_PLAY = "SPLASH_SCREEN_CLICK_PLAY",
    TOOLBAR_CLICK_FULL_SCREEN = "TOOLBAR_CLICK_FULL_SCREEN"
}

interface SWAGAPIOptions {
    apiKey: string;
    debug?: boolean;
    gameTitle?: string;
    analytics?: {
        gameId?: string;
    };
    leaderboards?: {
        dailyScoreLevelKey?: string;
    };
    leaderboardScreen?: true | {};
    splashScreen?: true | {
        showOnLoad?: boolean;
        containerElementId?: string;
        isBeta?: boolean;
        onClickPlay?: () => void;
        waitForAssets?: Promise<void>;
    };
    summaryScreen?: {
        containerElementId?: string;
    };
    toolbar?: true | {
        containerElementId?: string;
        initialToolbarState?: ToolbarState;
        titleIcon?: string;
        titleIconDark?: string;
    };
}
declare class SWAGAPI {
    private options;
    private ready;
    constructor(options: SWAGAPIOptions);
    private init;
    startSession(): Promise<void>;
    toggleFullScreen(): Promise<MessagePayload>;
    navigateToArchive(): Promise<MessagePayload>;
    navigateToTitle(keyword: string): Promise<MessagePayload>;
    navigateToHome(): Promise<MessagePayload>;
    getGame(): Promise<Game>;
    startDailyGame(eventProperties?: Record<string, any>): Promise<void>;
    completeDailyGame(day: string): Promise<unknown>;
    getCurrentDay(): `${number}-${number}-${number}`;
    getGameProgress(month: string, year: string): Promise<DailyGameProgress[]>;
    getGameStreak(): Promise<DailyGameStreak>;
    hasPlayedDay(day: string): Promise<boolean>;
    getScoreCategories(): Promise<GameModeData[]>;
    getDays(limit: number): Promise<any[]>;
    getScores(options: PostScoreOptions): Promise<LeaderboardData[]>;
    postScore(levelKey: string, value: string, options: PostScoreOptions): Promise<unknown>;
    postDailyScore(day: string, level_key: string, value: string): Promise<unknown>;
    hasDailyScore(levelKey: any): Promise<boolean>;
    getAchievementCategories(): Promise<any[]>;
    postAchievement(achievement_key: string): Promise<unknown>;
    getUserAchievements(): Promise<any[]>;
    getCurrentEntity(): Entity | null;
    isSubscriber(): Promise<boolean>;
    setUserData(key: string, value: string): Promise<unknown>;
    getUserData(): Promise<any>;
    setLocalUserData(key: string, value: string | null): void;
    getLocalUserData(key: string): string | null;
    postTag(tagName: string, properties?: Record<string, any>): Promise<void>;
    private showToolbar;
    setToolbarItems(items: ToolbarItem[]): void;
    updateToolbarItem(item: ToolbarItem): void;
    removeToolbarItem(id: string): void;
    showSplashScreen(options?: {
        isBeta?: boolean;
        onClickPlay?: () => void;
        waitForAssets?: Promise<void>;
    }): Promise<void>;
    showSummaryScreen(options: {
        stats: {
            key: string;
            value: string;
            lottie: object;
        }[];
        contentHtml: string;
        footerHtml?: string;
        shareString: string;
        eventProperties?: Record<string, any>;
        score?: string | number;
        hideStats?: boolean;
        onFavorite?: () => void;
        onReplay?: () => void;
        onClose?: () => void;
    }): Promise<void>;
    showLoader(debounce?: number): Promise<void>;
    hideLoader(): Promise<void>;
    getPlatform(): "embed" | "app" | "standalone";
    getPlatformTheme(): ('light' | 'dark');
    on(type: GlobalEventType, listener: EventListenerOrEventListenerObject): void;
    off(type: GlobalEventType, listener: EventListenerOrEventListenerObject): void;
}

declare class APIWrapper {
    getInstance(options: SWAGAPIOptions): SWAGAPI;
}

declare global {
  interface Window {
    SWAGAPI: APIWrapper;
  }
}

