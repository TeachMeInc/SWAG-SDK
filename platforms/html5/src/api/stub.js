/* stub methods to gracefully handle deactivated providers */
function stubMethods(self, config, utils, ui, data) {

    return {

        startSession: function() {
            utils.debug('session ready');
            self.emit(config.events.SESSION_READY, { session_ready: true });
            return Promise.resolve();
        },

        getScoreCategories: function() {
            return Promise.resolve([]);
        },

        getDays: function(limit) {
            return Promise.resolve([]);
        },

        getScores: function(options) {
            return Promise.resolve([]);
        },

        postScore: function(level_key, value, options) {
            return Promise.resolve();
        },

        postDailyScore: function(day, level_key, value) {
            return Promise.resolve();
        },

        getAchievementCategories: function() {
            return Promise.resolve();
        },

        postAchievement: function(achievement_key) {
            return Promise.resolve();
        },

        getUserAchievements: function() {
            return Promise.resolve();
        },

        postDatastore: function(key, value) {
            return Promise.resolve();
        },

        getUserDatastore: function() {
            return Promise.resolve();
        },

        populateLevelSelect: function(domId) {
            return Promise.resolve();
        },

        populateDaySelect: function(domId, limit) {
            return Promise.resolve();
        },

        populateAchievementSelect: function(domId) {
            return Promise.resolve();
        },

        getCurrentEntity: function() {
            return {};
        },

        showDialog: function(type, options) {
            return Promise.resolve();
        },

        isSubscriber: function() {
            return false;
        },

        hasDailyScore: function(level_key) {
            return false;
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
            return Promise.resolve({});
        },

        userLogout:  function() {
            return;
        }
    };

}

module.exports = stubMethods;