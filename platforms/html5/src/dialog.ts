'use strict';

import Emitter from 'component-emitter';
import * as bodyScrollLock from 'body-scroll-lock';
import Handlebars from 'handlebars';
import config from './config';
import session from './session';
import data from './data';
import ui from './dialog';
import utils from './utils';

// Template partials
import dialogHeader from './assets/templates/api/dialog-header.handlebars?raw';

// Templates
import dialog from './assets/templates/api/dialog.handlebars?raw';
import dialogScore from './assets/templates/api/dialog-scores.handlebars?raw';
import dialogDailyScore from './assets/templates/api/dialog-daily-scores.handlebars?raw';
import dialogScoreConfirmation from './assets/templates/api/dialog-score-confirmation.handlebars?raw';
import dataScore from './assets/templates/api/data-scores.handlebars?raw';
import dataScoreContext from './assets/templates/api/data-score-context.handlebars?raw';
import dataDailyScoreContext from './assets/templates/api/data-daily-scores-context.handlebars?raw';
import dialogAchievements from './assets/templates/api/dialog-achievements.handlebars?raw';
import dataAchievements from './assets/templates/api/data-achievements.handlebars?raw';
import dialogWeeklyScores from './assets/templates/api/dialog-weeklyscores.handlebars?raw';
import dataWeeklyScores from './assets/templates/api/data-weeklyscores.handlebars?raw';
import brandingAnimation from './assets/templates/api/branding-animation.handlebars?raw';
import dialogUserLogin from './assets/templates/api/dialog-user-login.handlebars?raw';
import dialogUserCreate from './assets/templates/api/dialog-user-create.handlebars?raw';

Handlebars.registerPartial('dialog-header', dialogHeader);

const templates: Record<string, HandlebarsTemplateDelegate> = {
  dialog: Handlebars.compile(dialog),
  dialogScore: Handlebars.compile(dialogScore),
  dialogDailyScore: Handlebars.compile(dialogDailyScore),
  dialogScoreConfirmation: Handlebars.compile(dialogScoreConfirmation),
  dataScore: Handlebars.compile(dataScore),
  dataScoreContext: Handlebars.compile(dataScoreContext),
  dataDailyScoreContext: Handlebars.compile(dataDailyScoreContext),
  dialogAchievements: Handlebars.compile(dialogAchievements),
  dataAchievements:  Handlebars.compile(dataAchievements),
  dialogWeeklyScores: Handlebars.compile(dialogWeeklyScores),
  dataWeeklyScores: Handlebars.compile(dataWeeklyScores),
  brandingAnimation: Handlebars.compile(brandingAnimation),
  dialogUserLogin: Handlebars.compile(dialogUserLogin),
  dialogUserCreate: Handlebars.compile(dialogUserCreate),
};

export type DialogType = 'scores' | 'dailyscores' | 'scoreconfirmation' | 'achievements' | 'weeklyscores' | 'userlogin' | 'usercreate';

export interface DialogOptions {
  theme?: string;
  title?: string;
  header?: {
    backButton: boolean;
  };
}

const dialogMethods: Record<DialogType, string> = {
  'scores': 'renderScoresDialog',
  'dailyscores': 'renderDailyScoresDialog',
  'scoreconfirmation': 'renderScoreConfirmationDialog',
  'achievements': 'renderAchievementsDialog',
  'weeklyscores': 'renderWeeklyScoresDialog',
  'userlogin': 'renderUserLoginDialog',
  'usercreate': 'renderUserCreateDialog'
};

const defaultDialogTitles: Record<DialogType, string> = {
  'scores': 'Best Scores',
  'dailyscores': 'Best Daily Scores',
  'scoreconfirmation': 'Score Submitted',
  'weeklyscores': 'Your Best Scores This Week',
  'achievements': 'Your Achievements',
  'userlogin': 'Sign In',
  'usercreate': 'Create Account'
};

const methods = Emitter({
  events: {
    UI_EVENT: 'UI_EVENT',
    UI_ERROR: 'UI_ERROR'
  },

  templates,
  dialogMethods,
  defaultDialogTitles,

  renderDialog: function(type: DialogType, options?: DialogOptions) {
    var self = this;
    var dialogOptions = Object.assign({
        theme: session.theme,
        header: {
            backButton: true
        }
    }, options);

    var title = options && options.title || self.defaultDialogTitles[type];

    if(title) {
      dialogOptions.title = title;
    }

    var progressDialog = self.templates['dialog'](dialogOptions);
    this.cleanStage();
    session.wrapper!.insertAdjacentHTML('afterbegin', progressDialog);
    var dialogEl = document.getElementById('swag-dialog')!;
    dialogEl.dataset['dialog'] = type;
    utils.applyBreakpointClass();

    bodyScrollLock.disableBodyScroll(session.wrapper!);
    document.body.classList.add('swag-dialog-open');

    if(methods.dialogMethods[type]) {
      // @ts-ignore
      return methods[dialogMethods[type]](dialogOptions)
        .then(function() {
            var backBtn = session.wrapper!.querySelectorAll('div[data-action="back"]');
            backBtn.forEach(function(el) {
              el.addEventListener('click', function(event) {
                  self.onCloseDialog(event);
              }, true);
            });

        });
    } else {
      ui.emit(self.events.UI_ERROR, config.events.INVALID_DIALOG_TYPE);
    }
  },

  renderScoresDialog: function(options: { period?: any; level_key?: any; value_formatter?: any; }) {
    const contentEl = document.getElementById('swag-dialog-content');
    options = options || {};

    return data.getScoreCategories()
      .then(function(categories) {
        const scoreDialog = methods.templates['dialogScore']({
          levels: categories
        });
        contentEl!.innerHTML = scoreDialog;

        const levelSelector = document.getElementById('swag-data-view-level') as HTMLSelectElement;
        const periodSelector = document.getElementById('swag-data-view-period') as HTMLSelectElement;
        const dataTableCont = document.getElementById('swag-data-table')!;
        const contextCont = document.getElementById('swag-score-context')!;

        if(options.period && periodSelector) {
          periodSelector.value = options.period;
        }

        if(categories.length <= 1) {
          levelSelector.style.display = 'none';
        }

        if(options.level_key && levelSelector) {
          levelSelector.value = options.level_key;
        }

        const scoreMethod = function(level_key: any, period: any) {
          dataTableCont!.innerHTML = '';
          contentEl!.classList.add('loading');

        const scoresContextOptions: {
          level_key: any;
          period: string;
          value_formatter?: any;
        } = {
          level_key: level_key,
          period: 'daily'
        };

        const scoresOptions: {
          type: string;
          level_key: any;
          period: any;
          value_formatter?: any;
        } = {
          type: 'standard',
          level_key: level_key,
          period: period
        };

        if(options.value_formatter) {
          scoresContextOptions.value_formatter = options.value_formatter;
          scoresOptions.value_formatter = options.value_formatter;
        }

        data.getScoresContext(scoresContextOptions)
          .then(function(scoresContext) {
            const contextFormatted = methods.templates['dataScoreContext']({
              context: scoresContext
            });
            contextCont.innerHTML = contextFormatted;
          })

        data.getScores(scoresOptions)
          .then(function(scores) {
            const selectedCategory = categories.find((category) => {
                return level_key === category.level_key;
            });

            const formatted = methods.templates['dataScore']({
              category: selectedCategory,
              scores: scores
            });

            dataTableCont!.innerHTML = formatted;

          })
          .finally(function() {
            contentEl!.classList.remove('loading');
          });
        };

        levelSelector.addEventListener('change', function() {
          return scoreMethod(levelSelector.options[levelSelector.selectedIndex].value,
            periodSelector.options[periodSelector.selectedIndex].value);
        }, true);

        periodSelector.addEventListener('change', function() {
          return scoreMethod(levelSelector.options[levelSelector.selectedIndex].value,
            periodSelector.options[periodSelector.selectedIndex].value);
        }, true);

        return scoreMethod(levelSelector.options[levelSelector.selectedIndex].value, periodSelector.options[periodSelector.selectedIndex].value);

      });
  },

  renderDailyScoresDialog: function(options: { day: any; level_key: any; value_formatter: any; }) {
    const contentEl = document.getElementById('swag-dialog-content');

    return Promise.all([data.getDays(), data.getScoreCategories()])
      .then(function(values) {
        const days = values[0];
        const categories = values[1];

        const scoreDialog = methods.templates['dialogDailyScore']({
          days: days,
          levels: categories
        });

        contentEl!.innerHTML = scoreDialog;

        const levelSelector = document.getElementById('swag-data-view-level') as HTMLSelectElement;
        const daySelector = document.getElementById('swag-data-view-day') as HTMLSelectElement;
        const dataTableCont = document.getElementById('swag-data-table');
        const contextCont = document.getElementById('swag-score-context');

        if(options.day) {
          daySelector.value = options.day;
        }

        if(categories.length <= 1) {
          levelSelector.style.display = 'none';
        }

        if(options.level_key) {
          levelSelector.value = options.level_key;
        }

        const scoreMethod = function(day: any, level_key: any) {
          dataTableCont!.innerHTML = '';
          contentEl!.classList.add('loading');

          const scoresContextOptions: {
            level_key: any;
            period: string;
            day: any;
            value_formatter?: any;
          } = {
            level_key: level_key,
            period: 'alltime',
            day: day
          };

          const scoresOptions: {
            type: string;
            level_key: any;
            period: string;
            day: any;
            value_formatter?: any;
          } = {
            type: 'daily',
            level_key: level_key,
            period: 'alltime', //daily scores are always displayed as all time
            day: day
          };

          if(options.value_formatter) {
            scoresContextOptions.value_formatter = options.value_formatter;
            scoresOptions.value_formatter = options.value_formatter;
          }

          return Promise.all([
            data.getScoresContext(scoresContextOptions),
            data.getScores(scoresOptions)
          ])
          .then(function(values) {

            const scoresContext = values[0];
            const scores = values[1];

            const selectedCategory = categories.find(function(category: { level_key: any; }) {
              return level_key === category.level_key;
            });

            const formatted = methods.templates['dataScore']({
              category: selectedCategory,
              scores: scores
            });

            dataTableCont!.innerHTML = formatted;

            const contextFormatted = methods.templates['dataDailyScoreContext']({
              context: scoresContext
            });

            contextCont!.innerHTML = contextFormatted;
          })
          .finally(function() {
            contentEl!.classList.remove('loading');
          });
        };

        daySelector.addEventListener('change', function() {
          return scoreMethod(daySelector.options[daySelector.selectedIndex].value,
            levelSelector.options[levelSelector.selectedIndex].value);
        }, true);

        levelSelector.addEventListener('change', function() {
          return scoreMethod(daySelector.options[daySelector.selectedIndex].value,
            levelSelector.options[levelSelector.selectedIndex].value);
        }, true);

        return scoreMethod(daySelector.options[daySelector.selectedIndex].value, levelSelector.options[levelSelector.selectedIndex].value);

      });
  },

  renderScoreConfirmationDialog: function(options: any) {
    const contentEl = document.getElementById('swag-dialog-content');
    const scoreConfirmationDialog = methods.templates['dialogScoreConfirmation'](options);
    contentEl!.classList.remove('loading');
    contentEl!.innerHTML = scoreConfirmationDialog;
    return new Promise<void>(function(resolve) {
      resolve();
    });
  },

  renderAchievementsDialog: function() {
    const contentEl = document.getElementById('swag-dialog-content');

    const achievementsDialog = methods.templates['dialogAchievements']({});
    contentEl!.innerHTML = achievementsDialog;

    const dataTableCont = document.getElementById('swag-data');

    const achievementsMethod = function() {
      dataTableCont!.innerHTML = '';
      contentEl!.classList.add('loading');
      return data.getUserAchievements()
      .then(function(achievements) {
        const formatted = methods.templates['dataAchievements']({
          achievements: achievements
        });
        dataTableCont!.innerHTML = formatted;
      })
      .finally(function() {
        contentEl!.classList.remove('loading');
      });
    };

    return achievementsMethod();

  },

  renderWeeklyScoresDialog: function(options: { title: any; value_formatter: any; }) {
    const contentEl = document.getElementById('swag-dialog-content');

    return data.getScoreCategories()
      .then(function(categories) {

        const scoreDialog = methods.templates['dialogWeeklyScores']({
          levels: categories,
          title: options.title
        });

        contentEl!.innerHTML = scoreDialog;

        const levelSelector = document.getElementById('swag-data-view-level') as HTMLSelectElement;
        const dataTableCont = document.getElementById('swag-data');

        const scoreMethod = function(level_key: any) {
          dataTableCont!.innerHTML = '';
          contentEl!.classList.add('loading');

          const scoresOptions: {
            type: string;
            level_key: any;
            value_formatter?: any;
          } = {
            type: 'weekly',
            level_key: level_key
          };

          if(options.value_formatter) {
            scoresOptions.value_formatter = options.value_formatter;
          }

          return data.getScores(scoresOptions)
          .then(function(scores) {
            const formatted = methods.templates['dataWeeklyScores']({
              weeklyscores: scores
            });
            dataTableCont!.innerHTML = formatted;
          })
          .finally(function() {
            contentEl!.classList.remove('loading');
          });
        };

        levelSelector.addEventListener('change', function() {
          return scoreMethod(levelSelector.options[levelSelector.selectedIndex].value);
        }, true);

        if(categories[0]) {
          return scoreMethod(levelSelector.options[0].value);
        }

      });
  },

  renderUserLoginDialog: function() {
    return new Promise<void>(function(resolve) {
      resolve();
    });
  },

  renderUserCreateDialog: function() {
    return new Promise<void>(function(resolve) {
      resolve();
    });
  },

  // UI Rendering
  cleanStage: function() {
    bodyScrollLock.clearAllBodyScrollLocks()
    document.body.classList.remove('swag-dialog-open');
    const elems = session.wrapper!.getElementsByClassName('swag-dialog-wrapper');
    Array.prototype.forEach.call(elems, function (elem) {
        elem.parentNode.removeChild(elem);
    });
  },

  populateLevelSelect: function(domId: string) {
    return data.getScoreCategories()
      .then(function(categories) {
        const levelSelect = document.getElementById(domId);
        if(levelSelect) {
          categories.map(function(category: { level_key: string; name: string; }) {
            const opt = document.createElement('option');
            opt.value= category.level_key;
            opt.innerHTML = category.name;
            levelSelect.appendChild(opt);
          });
        }
      });
  },

  populateDaySelect: function(domId: string, limit: number) {
    return data.getDays(limit)
      .then(function(days) {
        const daySelect = document.getElementById(domId);
        if(daySelect) {
          days.map(function(day: string) {
            const opt = document.createElement('option');
            opt.value= day;
            opt.innerHTML = day;
            daySelect.appendChild(opt);
          });
        }
      });
  },

  resize: function() {
    utils.debug('resize');
    utils.applyBreakpointClass();
  },

  populateAchievementSelect: function(domId: string) {
    return data.getAchievementCategories()
      .then(function(categories) {
        const achievementSelect = document.getElementById(domId) as HTMLSelectElement;
          categories.map(function(category: { achievement_key: string; name: string; }) {
            const opt = document.createElement('option');
            opt.value= category.achievement_key;
            opt.innerHTML = category.name;
            achievementSelect.appendChild(opt);
          });
      });
  },

  getBrandingLogo: function() {
    return new Promise<HTMLImageElement>(function(resolve, reject) {
      const img = new Image();
      img.onload = function() {
        resolve(img);
      };
      img.onerror = function(err) {
        reject(err);
      }
      //TODO: use appropriate logo for given context
      img.src = config.resourceRoot + 'shockwave-logo.svg';
    });
  },

  getBrandingLogoUrl: function() {
    return new Promise<string>(function(resolve) {
      resolve(config.resourceRoot + 'shockwave-logo.svg');
    });
  },

  showBrandingAnimation: function(targetElement: string, callback: () => void) {
    const el = document.getElementById(targetElement);
    return new Promise<void>(function(resolve) {
      const animationMarkup = methods.templates['brandingAnimation']({});
      el!.insertAdjacentHTML('afterbegin', animationMarkup);
      el!.classList.add('swag-branding-active');
      const wrapper = document.getElementById('swag-branding-animation-wrapper');
      const anim = document.getElementById('swag-branding-animation');
      anim!.onload = function() {
        window.setTimeout(function() {
            wrapper!.parentNode!.removeChild(wrapper!);
            el!.classList.remove('swag-branding-active');
            if(callback) callback();
            resolve();
        }, 4500);
      };
    });
  },

  leaderboardComponent: function() {
    return new Promise<void>(function(resolve) {
      resolve();
    });
  },

  onCloseDialog: function(event: { preventDefault: () => void; }) {
    event.preventDefault();
    this.cleanStage();
    ui.emit(methods.events.UI_EVENT, config.events.DIALOG_CLOSED);
  }
});

export default methods;
