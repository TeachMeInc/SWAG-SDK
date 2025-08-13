declare class APIWrapper {
    getInstance(options: SWAGAPIOptions): SWAGAPI;
    getInstanceAsync(options: SWAGAPIOptions): Promise<unknown>;
    showBrandingAnimation(element: string, callback: () => {}): Promise<void>;
    showLeaderboard(): Promise<void>;
}
export default APIWrapper;

declare interface DailyGameProgress {
    day: string;
    state: string;
}

declare interface DailyGameStreak {
    streak: number;
    maxStreak: number;
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

declare interface Entity {
    _id: string;
    memberName: string;
    isMember: boolean;
    token: string;
}

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

declare type MessageEventName = 'noop' | 'swag.toolbar.show' | 'swag.toolbar.hide' | 'swag.toggleFullScreen' | 'swag.navigateToArchive' | 'swag.navigateToGameLanding' | 'swag.navigateToLogin' | 'swag.navigateToTitle' | 'swag.displayAd' | 'swag.displayShareDialog' | 'swag.userLogout' | 'swag.getRelatedGames' | 'swag.captureEvent' | 'swag.dailyGameProgress.start' | 'swag.dailyGameProgress.complete';

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
    protected _options: SWAGAPIOptions;
    constructor(options: SWAGAPIOptions);
    protected _createPreactRoot(id: string): void;
    protected _init(): void;
    protected _getSiteMode(): 'shockwave';
    protected _emitError(errorType: string): void;
    protected _parseUrlOptions(prop: string): string | Record<string, string>;
    startSession(): Promise<void>;
    toggleFullScreen(): Promise<MessagePayload>;
    navigateToArchive(): Promise<MessagePayload>;
    navigateToGameLanding(): Promise<MessagePayload>;
    navigateToTitle(slug: string): Promise<MessagePayload>;
    captureEvent(event: string, params: any): Promise<MessagePayload>;
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
    getCurrentEntity(): Entity | null;
    isSubscriber(): Promise<boolean>;
    getCurrentUser(): Promise<unknown>;
    navigateToLogin(): Promise<MessagePayload>;
    userLogout(): Promise<MessagePayload>;
    setToolbarItems(items: ToolbarItem[]): void;
    updateToolbarItem(item: ToolbarItem): void;
    removeToolbarItem(id: string): void;
    showShareDialog(): Promise<MessagePayload>;
    showSummaryScreen(options: {
        stats: {
            key: string;
            value: string;
        }[];
        titleHtml: string;
        resultHtml: string;
        shareString: string;
        onReplay?: () => void;
        onClose?: () => void;
    }): Promise<void>;
    showSummaryV2Screen(options: {
        stats: {
            key: string;
            value: string;
            lottie: object;
        }[];
        contentHtml: string;
        shareString: string;
        onFavorite?: () => void;
        onReplay?: () => void;
        onClose?: () => void;
    }): Promise<void>;
    getPlatform(): "embed" | "app" | "standalone";
    getPlatformTheme(): ('light' | 'dark');
    startGame(): Promise<void>;
    endGame(): Promise<void>;
    showAd(): Promise<void>;
    showDialog(type: DialogType, options: DialogOptions): void;
    populateLevelSelect(domId: any): Promise<void>;
    populateDaySelect(domId: any, limit: any): Promise<void>;
    populateAchievementSelect(domId: any): Promise<void>;
    getBrandingLogo(): Promise<HTMLImageElement>;
    getBrandingLogoUrl(): Promise<string>;
}

declare interface SWAGAPIOptions {
    apiKey: string;
    gameTitle: string;
    wrapper: HTMLElement;
    summary?: {
        wrapperId?: string;
    };
    toolbar?: {
        wrapperId?: string;
        onClickFullScreen?: () => void;
        titleIcon?: string;
        titleIconDark?: string;
        initialToolbarState?: ToolbarState;
    };
    theme?: 'shockwave';
    api_key?: string;
}

declare interface ToolbarItem {
    id: string;
    label?: string;
    icon?: string;
    disabled?: boolean;
    toggled?: boolean;
    onClick?: () => void;
}

declare interface ToolbarState {
    items: ToolbarItem[];
}

export { }


declare global {
    interface Window {
        SWAGTHEME: string;
        SWAGAPI: APIWrapper;
    }
}

