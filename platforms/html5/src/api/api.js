'use strict';

var Emitter = require('component-emitter');
var config = require('../config');
var elementResizeEvent = require('element-resize-event');
var session = require('../session');
var data = require('./data');
var ui = require('./ui');
var utils = require('../utils');
var stubMethods = require("./stub.js")

var _isRendering = false;
// -----------------------------------------------------------------------------

function SWAGAPI(options) {
  var self = this;
  const { wrapper, api_key, theme } = options;
  this._options = { wrapper, api_key, theme };

  this._getSiteMode = function() {
    // priority for site mode is window.SWAGTHEME, swag options theme then based on domain hosting the game
    var domainTheme = location.hostname.split('.').reverse().splice(1,1).reverse().join('.');
    var reqTheme = window.SWAGTHEME || this._options.theme || domainTheme;
    return config.themes[reqTheme]
      ? reqTheme
      : 'shockwave';
  };

  var siteTheme = config.themes[this._getSiteMode()];
  var siteMethods = siteTheme.active ? activeMethods : stubMethods;
  
  Object.assign(this, { ...siteMethods, ...methods });

  this._init();
  Emitter(this);

  ui.on('UI_EVENT', function(event) {
    self.emit(event, {type: event});
  });

  ui.on('UI_ERROR', function(event) {
    self._emitError(event);
  });

  ui.on('DATA_ERROR', function(event) {
    self._emitError(event);
  });

  data.on('DATA_EVENT', function(event) {
    self.emit('DATA_EVENT', {type: event});
  });

  data.on('DATA_ERROR', function(event) {
    self._emitError(event);
  });

};

var activeMethods = {
  
  startSession: function() {
    var self = this;
    return data.getEntity()
      .then(function() {
        utils.debug('session ready');
        self.emit(config.events.SESSION_READY, { session_ready: true });
      });
  },

  getScoreCategories: function() {
    return data.getScoreCategories();
  },

  getDays: function(limit) {
    return data.getDays(limit);
  },

  getScores: function(options) {
    return data.getScores(options);
  },

  postScore: function(level_key, value, options) {
    return data.postScore(level_key, value, options)
      .then(function() {
        if(options && options.confirmation === true) {
          ui.renderDialog('scoreconfirmation', { value: value });
        }
      });
  },

  postDailyScore: function(day, level_key, value) {
    return data.postDailyScore(day, level_key, value);
  },

  getAchievementCategories: function() {
    return data.getAchievementCategories();
  },

  postAchievement: function(achievement_key) {
    return data.postAchievement(achievement_key);
  },

  getUserAchievements: function() {
    return data.getUserAchievements();
  },

  postDatastore: function(key, value) {
    return data.postDatastore(key, value);
  },

  getUserDatastore: function() {
    return data.getUserDatastore();
  },

  populateLevelSelect: function(domId) {
    return ui.populateLevelSelect(domId);
  },

  populateDaySelect: function(domId, limit) {
    return ui.populateDaySelect(domId, limit);
  },

  populateAchievementSelect: function(domId) {
    return ui.populateAchievementSelect(domId);
  },

  getCurrentEntity: function() {
    return session.entity;
  },

  showDialog: function(type, options) {
    return ui.renderDialog(type, options);
  },

  isSubscriber: function() {
    return data.isSubscriber();
  },

  hasDailyScore: function(level_key) {
    return data.hasDailyScore(level_key);
  },

  getCurrentDay: function() {
    return data.getCurrentDay();
  },

  getBrandingLogo: function() {
    return ui.getBrandingLogo();
  },

  getBrandingLogoUrl: function() {
    return ui.getBrandingLogoUrl();
  },

  startGame: function() {
    return ui.startGame();
  },

  endGame: function() {
    return ui.endGame();
  },

  showAd: function() {
    return ui.showAd();
  },

  postExternalMessage: function(message) {
    return data.postExternalMessage(message);
  },

  getCurrentUser: function() {
    return data.getCurrentUser();
  },

  userLogout:  function() {
    return data.userLogout();
  }
};

var methods = {
  
  _init: function() {
    var self = this;
    var siteMode = this._getSiteMode();
    session.api_key = this._options.api_key;
    session.wrapper = this._options.wrapper;
    session.wrapper.classList.add('swag-wrapper');
    session.theme = siteMode;
    session.provider = siteMode;
    session.apiRoot = config.themes[siteMode].apiRoot;

    elementResizeEvent(session.wrapper, function() {
      _isRendering = setTimeout(function() {
        ui.resize();
      }, 400);
    });
  },

  _emitError: function(errorType) {
    this.emit(this.ERROR, { type: errorType });
  },

  _parseUrlOptions: function(prop) {
    var params = {};
    if(window.location.href.indexOf('?') === -1) {
      return params;
    }
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );
    definitions.forEach( function( val, key ) {
      var parts = val.split( '=', 2 );
      params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
  }

};

module.exports = SWAGAPI;
