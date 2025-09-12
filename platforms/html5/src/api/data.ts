'use strict';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import session from '@/session';
import utils from '@/utils';
import config from '@/config';
import { Entity } from '@/types/Entity';
import { Game } from '@/types/Game';



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
      // Central error logging
      utils.warn('API request failed', error?.response?.status, error?.message);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

async function getJSON<T> (url: string, params?: Record<string, any>, configOverride?: AxiosRequestConfig): Promise<T> {
  const client = getAxios();
  const response = await client.get(url, { params, ...configOverride });
  return response.data as T;
}

async function postJSON<T> (url: string, body?: any, configOverride?: AxiosRequestConfig): Promise<T> {
  const client = getAxios();
  const response = await client.post(url, body, configOverride);
  return response.data as T;
}

// #endregion



class DataAPI {
  // events: {
  //   DATA_EVENT: 'DATA_EVENT',
  //   DATA_ERROR: 'DATA_ERROR',
  //   USER_LOGIN: 'USER_LOGIN',
  //   USER_LOGOUT: 'USER_LOGOUT'
  // }

  // #region Game Methods

  async getGame (): Promise<Game> {
    return await getJSON<Game>('/v1/game', { game: session.apiKey });
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

  async getCurrentDay () {
    const padDateDigit = function (number: string | number) {
      if (typeof number === 'number' && number <= 99) { number = ('000' + number).slice(-2); }
      return number;
    };

    const urlParams = utils.parseUrlParams();

    if (urlParams.day && urlParams.month && urlParams.year) {
      const yearPart = parseInt(urlParams.year, 10);
      const dayParts = [
        (yearPart > 2000 ? yearPart : 2000 + yearPart), // handle both 4 digit and 2 digit years
        padDateDigit(parseInt (urlParams.month, 10)),
        padDateDigit(parseInt (urlParams.day, 10))
      ];
      return { day: dayParts.join('-') };
    } 

    else if (urlParams.date) {
      const parts = urlParams.date.split('/');
      parts[ 0 ] = (2000 + parseInt(parts[ 0 ], 10)).toString();
      return { day: parts.join('-') };
    }

    else {
      return await getJSON<{ day: string }>('/v1/currentday');
    }
  }

  async getDays (limit: number = 30): Promise<any[]> {
    return await getJSON<any[]>('/v1/days', { game: session.apiKey, limit });
  }

  async getScores (options: PostScoreOptions): Promise<LeaderboardData[]> {
    const { day, type, level_key, period, current_user, target_date, value_formatter, use_daily } = options;
    const params = { game: session.apiKey, day, type, level_key, period, current_user, target_date, value_formatter, use_daily };
    return await getJSON<LeaderboardData[]>('/v1/scores', params);
  }

  async getScoresContext (options: PostScoreOptions): Promise<UserBestData> {
    const { day, type, level_key, period, target_date, value_formatter } = options;
    const params = { game: session.apiKey, day, type, level_key, period, target_date, value_formatter };
    return await getJSON<UserBestData>('/v1/scores/context', params);
  }

  async postScore (level_key: string, value: string, options: PostScoreOptions) {
    const body: ScoreBodyData = { game: session.apiKey, level_key, value };
    if (options?.meta) body.meta = options.meta;
    return await postJSON('/v1/score', body);
  }

  async postDailyScore (day: string, level_key: string, value: string) {
    const body = { game: session.apiKey, day, level_key, value };
    return await postJSON('/v1/dailyscore', body);
  }

  // #endregion



  // #region Daily Game Methods
  
  async postDailyGameProgress (day: string, complete: boolean) {
    const body = { game: session.apiKey, day, complete };
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

  // #endregion



}

export default new DataAPI();