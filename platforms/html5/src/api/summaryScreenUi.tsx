import dataApi, { DailyGameStreak, GamePromoLink, UserBestData } from '@/api/data';
import SummaryScreen from '@/components/features/summaryScreen/SummaryScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import lottieStreak from '@/assets/lottie/streak.json';
import lottieTime from '@/assets/lottie/time.json';
import lottiePosition from '@/assets/lottie/position.json';
import utils from '@/utils';
import loaderUi from '@/api/loaderUi';
import messagesApi from '@/api/messages';
import config from '@/config';

export type ShowSummaryScreenOptions = {
  stats: { key: string, value?: string, lottie?: object }[], 
  contentHtml: string, 
  footerHtml?: string,
  shareString: string, 
  hideStats?: boolean,
  onFavorite?: () => void,
  onReplay?: () => void,
  onClose?: () => void,
  hasLeaderboard?: boolean,
  eventProperties?: Record<string, any>,
  score: {
    levelKey: string,
    value?: string | number
  }
}

class SummaryScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-summaryScreen-root';
  protected rootElClassName: string = 'swag-summaryScreen-root';

  async show (options: ShowSummaryScreenOptions) {
    loaderUi.show(config.loaderDelay);

    const day = utils.getDateString();
    const eventProperties = options.eventProperties || {};

    try {
      await dataApi.postDailyGameProgress(day, true, eventProperties);
    } catch (err) {
      utils.error('Error posting daily game progress:', err);
    }
    messagesApi.trySendMessage('swag.dailyGameProgress.complete', day, true);

    /*
     * Collect batch calls
     */

    const promises = [];

    // Fetch member status
    promises.push((async () => {
      try {
        const entity = await dataApi.getEntity();
        return !!entity.member;
      } catch (e) {
        utils.warn('Error checking membership status:', e);
      }
    })());

    // Fetch subscriber status
    promises.push((async () => {
      try {
        return await dataApi.isSubscriber();
      } catch (e) {
        utils.warn('Error checking subscription status:', e);
      }
    })());

    // Check if the game has been played today
    promises.push((async () => {
      try {
        return await dataApi.hasPlayedDay(utils.getDateString());
      } catch (e) {
        utils.warn('Error checking if game has been played today:', e);
      }
    })());

    // Fetch daily game streak
    promises.push((async () => {
      let gameStreak: DailyGameStreak = { streak: 0, maxStreak: 0 };
      try {
        gameStreak = await dataApi.getDailyGameStreak();
      } catch (e) {
        utils.warn('Error fetching game streak:', e);
      }
      return gameStreak;
    })());

    // Fetch promo links
    promises.push((async () => {
      try {
        return await dataApi.getGamePromoLinks(6);
      } catch (e) {
        utils.warn('Error fetching promo links:', e);
      }
    })());

    // Post score
    if (options.score.value !== undefined) {
      const postDailyScoreFn = async () => {
        try {
          return await dataApi.postDailyScore(day, options.score.levelKey, options.score.value!);
        } catch (e) {
          utils.warn('Error posting daily score:', e);
        }
      };
      promises.push(postDailyScoreFn());
    } else {
      promises.push(Promise.resolve(undefined));
    }

    let batchedResult;
    try {
      batchedResult = await Promise.all(promises) as [
        boolean,                  // member status
        boolean,                  // subscriber status
        boolean,                  // has played today
        DailyGameStreak,          // game streak
        GamePromoLink[],          // promo links
        boolean | undefined,      // score post result
      ];
    } catch (e) {
      utils.error('Error during batch calls for summary screen:', e);
      return;
    } finally {
      loaderUi.hide();
    }

    const [ 
      isMember, 
      isSubscriber, 
      hasPlayedToday,
      gameStreak,
      promoLinks,
      _scorePostResult,
    ] = batchedResult;

    let stats = options.stats.map(stat => ({ 
      key: stat.key, 
      value: stat.value || '', 
      lottie: stat.lottie || {}
    }));

    // Add streak stat at the top
    stats.unshift(
      {
        key: 'Streak',
        value: String(gameStreak.streak).padStart(3, '0'),
        lottie: lottieStreak
      }
    );
    
    // Add time stat if it exists
    const timeStat = stats.find(stat => stat.key.toLowerCase() === 'time');
    if (timeStat) {
      timeStat.lottie = lottieTime;
    }

    // Fetch player position if position stat is enabled
    let playerPosition: UserBestData | undefined;
    if (options.stats?.find(stat => stat.key.toLowerCase() === 'position')) {
      const fetchPlayerPositionFn = async () => {
        try {
          return await dataApi.getScoresContext({
            day,
            level_key: options.score.levelKey,
            period: 'alltime',
          });
        } catch (e) {
          utils.warn('Error fetching player position:', e);
        }
      };
      playerPosition = await fetchPlayerPositionFn();
    }

    // Update position stat if it exists (display for members only)
    if (stats.find(stat => stat.key.toLowerCase() === 'position')) {
      if (isMember) {
        const positionStat = stats.find(stat => stat.key.toLowerCase() === 'position')!;
        if (playerPosition !== undefined) {
          positionStat.value = utils.formatOrdinal(Number(playerPosition.scorePosition?.value));
          positionStat.lottie = lottiePosition;
        } else {
          // Remove position stat if we couldn't fetch it
          stats = stats.filter(stat => stat.key.toLowerCase() !== 'position');
        }
      } else {
        // Remove position stat for non-members
        stats = stats.filter(stat => stat.key.toLowerCase() !== 'position');
      }
    }

    this.mount(<SummaryScreen 
      stats={stats} 
      contentHtml={options.contentHtml}
      footerHtml={options.footerHtml}
      promoLinks={promoLinks}
      shareString={options.shareString}
      isMember={isMember}
      isSubscriber={isSubscriber}
      hideStats={options.hideStats}
      hasPlayedToday={hasPlayedToday}
      isInjected={this.isInjected}
      onFavorite={options.onFavorite}
      onReplay={() => {
        if (options.onReplay) options.onReplay();
        if (options.onClose) options.onClose();
      }}
      hasLeaderboard={options.hasLeaderboard}
    />);
  }

  protected onMount () {
    if (!this.isInjected) document.body.classList.add('swag-summaryScreen-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-summaryScreen-open');
  }
}

export default new SummaryScreenUI();
