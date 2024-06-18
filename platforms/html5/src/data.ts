'use strict';

import Emitter from 'component-emitter';
import config from './config';
import session from './session';
import utils from './utils';

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
  },
  scorePosition?: {
    value: number | '-'
  },
  totalScores?: {
    value: number | '-'
  }
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

interface ScoreBodyData {
  game: string | null;
  level_key: string;
  value: string;
  meta?: any;
}

const methods = Emitter({
  events: {
    DATA_EVENT: 'DATA_EVENT',
    DATA_ERROR: 'DATA_ERROR',
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT'
  },

  apiMethods: {
    'getEntity': '/v1/user',
    'getSubscriber': '/v1/subscriber',
    'getScoreCategories': '/v1/score/categories',
    'getDays': '/v1/days',
    'getScores': '/v1/scores',
    'getScoresContext': '/v1/scores/context',
    'hasDailyScore': '/v1/scores/hasDailyScore',
    'getAchievementCategories': '/v1/achievement/categories',
    'getUserAchievements': '/v1/achievement/user',
    'getUserDatastore': '/v1/datastore/user',
    'getCurrentDay': '/v1/currentday',
    'getTokenBalance': '/v1/tokenbalance',
    'postScore': '/v1/score',
    'postDailyScore': '/v1/dailyscore',
    'postAchievement': '/v1/achievement',
    'postDatastore': '/v1/datastore'
  },

  

  // #region API Methods

  buildUrlParamString: function (params: any) {
    return params && params instanceof Object
      ? '?' + Object.keys(params).map(function (key) {
        return key + '=' + utils.formatParam(params[ key ]);
      }).join('&')
      : '';
  },

  getAPIData: function (options: { apiRoot?: any; params?: any; method: any; }) {
    const promise = new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      const rootUrl = options.apiRoot || config.themes[ session.theme! ].apiRoot;
      const params = methods.buildUrlParamString(options.params);
      xhr.open('GET', encodeURI(rootUrl + options.method + params));
      xhr.withCredentials = true;
      xhr.onload = function () {
        const response = xhr.status === 200
          ? JSON.parse(xhr.response)
          : null;
        if(response && !response.error) {
          resolve(response);
        } else {
          methods.emit(methods.events.DATA_ERROR, config.events.API_COMMUNICATION_ERROR);
          reject(response);
        }
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 0) {
          methods.emit(methods.events.DATA_ERROR, config.events.API_COMMUNICATION_ERROR);
          reject();
        }
      };
      xhr.onerror = function () {
        methods.emit(methods.events.DATA_ERROR, config.events.API_COMMUNICATION_ERROR);
        reject();
      };
      xhr.send();
    });
    return promise;
  },

  postAPIData: function (options: { apiRoot?: any; contentType?: string; method: any; body: any; params?: string; }) {
    const promise = new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      const rootUrl = options.apiRoot || config.themes[ session.theme! ].apiRoot;
      const contentType = options.contentType || 'application/json;charset=UTF-8';
      xhr.open('POST', encodeURI(rootUrl + options.method), true);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.withCredentials = true;
      xhr.onload = function () {
        const response = xhr.status === 200
          ? JSON.parse(xhr.response)
          : null;
        if(response && !response.error) {
          resolve(response);
        } else {
          methods.emit(methods.events.DATA_ERROR, config.events.API_COMMUNICATION_ERROR);
          reject(response);
        }
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 0) {
          methods.emit(methods.events.DATA_ERROR, config.events.API_COMMUNICATION_ERROR);
          reject();
        }
      };
      xhr.onerror = function () {
        methods.emit(methods.events.DATA_ERROR, config.events.API_COMMUNICATION_ERROR);
        reject();
      };
      xhr.send(JSON.stringify(options.body));
    });
    return promise;
  },

  // #endregion



  // #region Score Methods

  hasDailyScore: function (level_key: any) {
    const promise = new Promise(function (resolve) {
      if(session.uid) {
        session.entity = session.uid;
        resolve(session.uid);
      } else {
        methods.getAPIData({
          method: methods.apiMethods[ 'hasDailyScore' ],
          params: {
            game: session[ 'api_key' ],
            level_key: level_key
          }
        })
          .then(function (result: any) {
            resolve(!!result.daily_score);
          });
      }
    });
    return promise;
  },

  getScoreCategories: function () {
    const promise = new Promise<GameModeData[]>(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getScoreCategories' ],
        params: {
          game: session[ 'api_key' ]
        }
      })
        .then(function (categories: any) {
          resolve(categories);
        });
    });
    return promise;
  },

  getCurrentDay: function () {
    const padDateDigit = function (number: string | number) {
      if (typeof number === 'number' && number <= 99) { number = ('000' + number).slice(-2); }
      return number;
    };

    const promise = new Promise(function (resolve) {
      const urlParams = utils.parseUrlParams();
      if (urlParams.day && urlParams.month && urlParams.year) {
        const dayParts = [
          (2000 + parseInt (urlParams.year, 10)),
          padDateDigit(parseInt (urlParams.month, 10)),
          padDateDigit(parseInt (urlParams.day, 10))
        ];
        resolve({ day: dayParts.join('-') });
      } else {
        methods.getAPIData({
          method: methods.apiMethods[ 'getCurrentDay' ],
          params: {}
        })
          .then(function (data) {
            resolve(data);
          });
      }
    });

    return promise;
  },

  getDays: function (limit?: number) {
    const dayLimit = limit || 30;
    const promise = new Promise<any[]>(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getDays' ],
        params: {
          game: session[ 'api_key' ],
          limit: dayLimit
        }
      })
        .then(function (days: any) {
          resolve(days);
        });
    });
    return promise;
  },

  getScores: function (options: PostScoreOptions) {
    const { day, type, level_key, period, current_user, target_date, value_formatter, use_daily } = options;
    const clean = { day, type, level_key, period, current_user, target_date, value_formatter, use_daily };
    const params = Object.assign({ game: session[ 'api_key' ] }, clean);

    const promise = new Promise<LeaderboardData[]>(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getScores' ],
        params: params
      })
        .then(function (scores: any) {
          resolve(scores);
        });
    });
    return promise;
  },

  getScoresContext: function (options: PostScoreOptions) {
    const { day, type, level_key, period, target_date, value_formatter } = options;
    const clean = { day, type, level_key, period, target_date, value_formatter };
    const params = Object.assign({ game: session[ 'api_key' ] }, clean);

    const promise = new Promise<UserBestData>(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getScoresContext' ],
        params: params
      })
        .then(function (scoresContext: any) {
          resolve(scoresContext);
        });
    });
    return promise;
  },

  postScore: function (level_key: string, value: string, options: PostScoreOptions) {
    const body: ScoreBodyData = {
      game: session.api_key,
      level_key: level_key,
      value: value,
    };

    if(options && options.meta) {
      body.meta = options.meta;
    }

    const urlParamsString = methods.buildUrlParamString(body);
    return methods.postAPIData({
      method: methods.apiMethods[ 'postScore' ],
      body: body,
      params: urlParamsString,
    });
  },

  postDailyScore: function (day: string, level_key: string, value: string) {
    const body = {
      game: session.api_key,
      day: day,
      level_key: level_key,
      value: value
    };
    const urlParamsString = methods.buildUrlParamString(body);
    return methods.postAPIData({
      method: methods.apiMethods[ 'postDailyScore' ],
      body: body,
      params: urlParamsString
    });
  },

  // #endregion



  // #region Achievement Methods

  getAchievementCategories: function () {
    const promise = new Promise<any[]>(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getAchievementCategories' ],
        params: {
          game: session[ 'api_key' ]
        }
      })
        .then(function (categories: any) {
          resolve(categories);
        });
    });
    return promise;
  },

  getUserAchievements: function () {
    const promise = new Promise<any[]>(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getUserAchievements' ],
        params: {
          game: session[ 'api_key' ]
        }
      })
        .then(function (achievements: any) {
          resolve(achievements);
        });
    });
    return promise;
  },

  postAchievement: function (achievement_key: string) {
    const body = {
      game: session.api_key,
      achievement_key: achievement_key
    };
    const urlParamsString = methods.buildUrlParamString(body);
    return methods.postAPIData({
      method: methods.apiMethods[ 'postAchievement' ],
      body: body,
      params: urlParamsString
    });
  },

  // #endregion


  // #region User Cloud Datastore

  getUserDatastore: function () {
    const promise = new Promise(function (resolve) {
      methods.getAPIData({
        method: methods.apiMethods[ 'getUserDatastore' ],
        params: {
          game: session[ 'api_key' ]
        }
      })
        .then(function (data) {
          resolve(data);
        });
    });
    return promise;
  },

  postDatastore: function (key: string, value: string) {
    const body = {
      game: session.api_key,
      key: key,
      value: value
    };

    const urlParamsString = methods.buildUrlParamString(body);

    return methods.postAPIData({
      method: methods.apiMethods[ 'postDatastore' ],
      body: body,
      params: urlParamsString
    });
  },

  // #endregion



  // #region User Methods

  getEntity: function () {
    const promise = new Promise(function (resolve) {
      if(session.uid) {
        session.entity = session.uid;
        resolve(session.uid);
      } else {
        methods.getAPIData({
          method: methods.apiMethods[ 'getEntity' ]
        })
          .then(function (entity) {
            session.entity = entity as string;
            resolve(entity);
          });
      }
    });
    return promise;
  },

  isSubscriber: function () {
    const promise = new Promise<boolean>(function (resolve) {
      if(!session.uid) {
        resolve(false);
      } else {
        methods.getAPIData({
          method: methods.apiMethods[ 'getSubscriber' ]
        })
          .then(function (result: any) {
            resolve(!!result.subscriber);
          });
      }
    });
    return promise;
  },

  getTokenBalance: function () {
    const promise = new Promise(function (resolve) {
      if(session.uid) {
        session.entity = session.uid;
        resolve(session.uid);
      } else {
        methods.getAPIData({
          method: methods.apiMethods[ 'getTokenBalance' ]
        })
          .then(function (result) {
            resolve(result);
          });
      }
    });
    return promise;
  },

  getCurrentUser: function () {
    const provider = methods.getProvider();
    const promise = new Promise(function (resolve, reject) {
      methods.getAPIData({
        apiRoot: provider.root,
        method: provider.current
      })
        .then(function (result: any) {
          if(result && !result.error) {
            resolve(result);
          } else {
            reject();
          }
        });
    });
    return promise;
  },

  // #endregion



  // #region Internal API

  getProvider: function () {
    return config.providers[ session.provider! ] || config.providers[ 'shockwave' ];
  },

  // #endregion
});

export default methods;
