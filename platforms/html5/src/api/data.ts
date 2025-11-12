import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import session from '@/session';
import utils from '@/utils';
import config from '@/config';
import { Entity } from '@/types/Entity';
import { Game } from '@/types/Game';
import globalEventHandlerApi, { GlobalEventType } from '@/api/globalEventHandler';
import swStampWhite from '@/assets/sw-stamp-white.svg';



// #region Types

export const LEADERBOARD_PERIOD = {
  daily: 'Daily',
  weekly: 'Weekly',
  alltime: 'All Time',
};

export type LeaderboardPeriod = keyof typeof LEADERBOARD_PERIOD;

export interface LeaderboardData {
  level_key: string
  value: string
  date_created: string
  screen_name: string
  leaderboard_name?: string
  avatarUrl: string
}

export interface GameModeData {
  game: string
  name: string
  level_key: string
  value_type: 'time' | 'score'
  value_name: string
  reverse: boolean
  order: number
}

export interface UserBestData {
  dailyBest?: {
    value: string
  }
  scorePosition?: {
    value: number | '-'
  }
  totalScores?: {
    value: number | '-'
  }
}

export interface DailyGameProgress {
  day: string
  state: string
}

export interface DailyGameStreak {
  streak: number,
  maxStreak: number
}

export interface PostScoreOptions {
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

export interface GamePromoLink {
  icon_url: string;
  background_color: string;
  title: string;
  url: string;
  type: string;
}

interface ScoreBodyData {
  game: string | null;
  level_key: string;
  value: string;
  meta?: any;
}

// #endregion



// #region Axios Setup

let axiosInstance: AxiosInstance | null = null;

function getAxios (): AxiosInstance {
  if (axiosInstance) return axiosInstance;

  const baseURL = config.apiRoot;
  axiosInstance = axios.create({
    baseURL,
    withCredentials: !session.jwt, // only send cookies when we don't already have a token
    timeout: 15000,
  });

  axiosInstance.interceptors.request.use((req) => {
    // Always refresh baseURL in case theme changed at runtime
    req.baseURL = config.apiRoot;
    req.headers = req.headers || {};
    (req.headers as Record<string, string>)[ 'x-local-tz' ] = utils.getTimeZone();
    if (session.jwt) {
      (req.headers as Record<string, string>)[ 'x-member-token' ] = session.jwt;
      req.withCredentials = false; // no need for cookies if token present
    } else {
      req.withCredentials = true;
    }
    return req;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      globalEventHandlerApi.dispatchEvent(new CustomEvent(GlobalEventType.API_COMMUNICATION_ERROR, { detail: error }));
      utils.error('API request failed', error?.response?.status, error?.message);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

async function getJSON <T> (url: string, params?: Record<string, any>, configOverride?: AxiosRequestConfig): Promise<T> {
  const client = getAxios();
  const response = await client.get(url, { params, ...configOverride });
  return response.data as T;
}

async function postJSON <T> (url: string, body?: any, configOverride?: AxiosRequestConfig): Promise<T> {
  const client = getAxios();
  const response = await client.post(url, body, configOverride);
  return response.data as T;
}

// #endregion



class DataAPI {



  // #region Server Health

  async measureNetworkLatency (): Promise<number> {
    const startTime = Date.now();
    await getAxios().get(
      `/v1/server/uptime?t=${Date.now()}`,
      { responseType: 'arraybuffer' }
    );
    return Date.now() - startTime;
  }

  // #endregion



  // #region Game Methods

  async getGame (): Promise<Game> {
    if (session.game) return session.game;
    const game = await getJSON<Game>('/v1/game', { game: session.apiKey });
    session.game = {
      ...game,
      archive_background_color: game.archive_background_color || '#3377cc',
      archive_icon: game.archive_icon || swStampWhite,
      shockwave_keyword: Array.isArray(game.shockwave_keyword)
        ? game.shockwave_keyword[ 0 ]
        : game.shockwave_keyword
    };
    return game;
  }

  // #endregion



  // #region Score Methods

  async hasDailyScore (level_key: any): Promise<boolean> {
    const result = await getJSON<{ daily_score?: any }>('/v1/scores/hasDailyScore', {
      game: session.apiKey,
      level_key
    });
    return !!result.daily_score;
  }

  async getScoreCategories (): Promise<GameModeData[]> {
    return await getJSON<GameModeData[]>('/v1/score/categories', { game: session.apiKey });
  }

  async getDays (limit: number = 30): Promise<any[]> {
    return await getJSON<any[]>('/v1/days', { game: session.apiKey, limit });
  }

  async getScores (options: PostScoreOptions = {}): Promise<LeaderboardData[]> {
    const params = { 
      ...options,
      game: session.apiKey
    };
    return await getJSON<LeaderboardData[]>('/v1/scores', params);
  }

  async getScoresContext (options: PostScoreOptions = {}): Promise<UserBestData> {
    const params = { 
      ...options,
      game: session.apiKey, 
    };
    return await getJSON<UserBestData>('/v1/scores/context', params);
  }

  async postScore (level_key: string, value: string, options: PostScoreOptions = {}) {
    const body: ScoreBodyData = { 
      ...options,
      game: session.apiKey, 
      level_key, 
      value 
    };
    return await postJSON('/v1/score', body);
  }

  async postDailyScore (day: string, level_key: string, value: string | number) {
    const body = { game: session.apiKey, day, level_key, value };
    return await postJSON('/v1/dailyscore', body);
  }

  async getLeaderboardCodeStats (code: string) {
    return await getJSON<any>('/v1/leaderboardcode/stats', { code });
  }

  async postLeaderboardCodeAllocate () {
    const result = await postJSON<{ code: string }>('/v1/leaderboardcode/allocate', { game: session.apiKey });
    if (session.entity) {
      if (!session.entity.leaderboards) {
        session.entity.leaderboards = [];
      }
      if (!session.entity?.leaderboards.includes(result.code)) {
        session.entity.leaderboards.push(result.code);
      }
    }
    return result;
  }

  async postUserLeaderboardName (leaderboard_name: string) {
    return await postJSON('/v1/user/leaderboard/name', { leaderboard_name });
  }

  async postUserLeaderboardJoin (leaderboard: string) {
    return await postJSON('/v1/user/leaderboard/join', { leaderboard });
  }

  async postUserLeaderboardLeave (leaderboard: string) {
    return await postJSON('/v1/user/leaderboard/leave', { leaderboard });
  }

  // #endregion



  // #region Daily Game Methods
  
  async postDailyGameProgress (day: string, complete: boolean, properties: Record<string, any> = {}) {
    if (session.analyticsId) {
      properties.id = session.analyticsId;
    }
    if (!properties.title) {
      properties.title = session.gameTitle;
    }
    const hostUrl = await utils.getPlatformUrl();
    properties = {
      ...properties,
      sdk_version: config.version,
      platform: utils.getPlatform(),
      $current_url: hostUrl,
    };

    const body = { game: session.apiKey, day, complete, properties };
    return await postJSON('/v1/dailygameprogress', body);
  }

  async getDailyGameProgress (month: string, year: string): Promise<DailyGameProgress[]> {
    return await getJSON<DailyGameProgress[]>('/v1/dailygameprogress', { game: session.apiKey, month, year });
  }

  async getDailyGameStreak (): Promise<DailyGameStreak> {
    return await getJSON<DailyGameStreak>('/v1/dailygamestreak', { game: session.apiKey });
  }

  async hasPlayedDay (day: string): Promise<boolean> {
    const parts = day.split('-');
    const query = { year: parts[ 0 ], month: parts[ 1 ] };
    const progress = await this.getDailyGameProgress(query.month, query.year);

    const found = progress.find((item: DailyGameProgress) => item.day === day);
    if (found && found.state === 'complete') {
      return true;
    }

    return false;
  }

  async getGamePromoLinks (limit: number = 1): Promise<GamePromoLink[]> {
    return await getJSON<GamePromoLink[]>('/v1/promolinks', { game: session.apiKey, n: Number(limit) });
  }
  
  // #endregion


  
  // #region Achievement Methods

  async getAchievementCategories (): Promise<any[]> {
    return await getJSON<any[]>('/v1/achievement/categories', { game: session.apiKey });
  }

  async getUserAchievements (): Promise<any[]> {
    return await getJSON<any[]>('/v1/achievement/user', { game: session.apiKey });
  }

  async postAchievement (achievement_key: string) {
    const body = { game: session.apiKey, achievement_key };
    return await postJSON('/v1/achievement', body);
  }

  // #endregion



  // #region User Cloud Datastore

  async getUserDatastore () {
    return await getJSON<any>('/v1/datastore/user', { game: session.apiKey });
  }

  async postDatastore (key: string, value: string) {
    const body = { game: session.apiKey, key, value };
    return await postJSON('/v1/datastore', body);
  }

  // #endregion



  // #region User Methods

  async getEntity (): Promise<Entity> {
    if (session.entity) return session.entity;
    const entity = await getJSON<Entity>('/v1/user');
    session.entity = entity;
    if (utils.getPlatform() === 'standalone') {
      session.jwt = entity.token;
      localStorage.setItem('swag_token', entity.token);
    }
    return entity;
  }

  async isSubscriber (): Promise<boolean> {
    const result = await getJSON<{ subscriber?: boolean }>('/v1/subscriber');
    return !!result.subscriber;
  }

  async postTag (tagName: string, properties: Record<string, any> = {}) {
    if (session.analyticsId) {
      properties.id = session.analyticsId;
    }
    if (!properties.title) {
      properties.title = session.gameTitle;
    }
    const hostUrl = await utils.getPlatformUrl();
    const body = {
      game: session.apiKey,
      properties: {
        ...properties,
        tag_name: tagName,
        sdk_version: config.version,
        platform: utils.getPlatform(),
        $current_url: hostUrl,
      },
    };

    return await postJSON('/v1/user/tag', body);
  }

  async sendTagBeacon (tagName: string, properties: Record<string, any> = {}) {
    if (session.analyticsId) {
      properties.id = session.analyticsId;
    }
    if (!properties.title) {
      properties.title = session.gameTitle;
    }
    const hostUrl = await utils.getPlatformUrl();
    const body = {
      game: session.apiKey,
      properties: {
        ...properties,
        tag_name: tagName,
        sdk_version: config.version,
        platform: utils.getPlatform(),
        $current_url: hostUrl,
      },
    };
    
    const bodyData = new Blob([ JSON.stringify(body) ], { type: 'application/json' });

    navigator.sendBeacon(
      `${config.apiRoot}/v1/user/tag`,
      bodyData
    );
  }

  // #endregion


  
}

export default new DataAPI();
