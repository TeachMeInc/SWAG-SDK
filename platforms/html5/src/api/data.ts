'use strict';

import session from '../session';
import data, { PostScoreOptions } from '../data';

interface ScoreBodyData {
  game: string | null;
  level_key: string;
  value: string;
  meta?: any;
}

const methods = {
  apiMethods: Object.assign(data.apiMethods, {
    'postScore': '/v1/score',
    'postDailyScore': '/v1/dailyscore',
    'postAchievement': '/v1/achievement',
    'postDatastore': '/v1/datastore'
  }),

  postScore: function(level_key: string, value: string, options: PostScoreOptions) {
    const body: ScoreBodyData = {
      game: session.api_key,
      level_key: level_key,
      value: value,
    };

    if(options && options.meta) {
      body.meta = options.meta;
    }

    const urlParamsString = data.buildUrlParamString(body);
    return data.postAPIData({
      method: methods.apiMethods['postScore'],
      body: body,
      params: urlParamsString,
    });
  },

  postDailyScore: function(day: string, level_key: string, value: string) {
    const body = {
      game: session.api_key,
      day: day,
      level_key: level_key,
      value: value
    };
    const urlParamsString = data.buildUrlParamString(body);
    return data.postAPIData({
      method: methods.apiMethods['postDailyScore'],
      body: body,
      params: urlParamsString
    });
  },

  postAchievement: function(achievement_key: string) {
    const body = {
      game: session.api_key,
      achievement_key: achievement_key
    };
    const urlParamsString = data.buildUrlParamString(body);
    return data.postAPIData({
      method: methods.apiMethods['postAchievement'],
      body: body,
      params: urlParamsString
    });
  },

  postDatastore: function(key: string, value: string) {
    const body = {
      game: session.api_key,
      key: key,
      value: value
    };

    const urlParamsString = data.buildUrlParamString(body);

    return data.postAPIData({
      method: methods.apiMethods['postDatastore'],
      body: body,
      params: urlParamsString
    });
  },
};

export default Object.assign(data, methods);
