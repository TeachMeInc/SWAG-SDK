import dataApi, { DailyGameStreak, GamePromoLink } from '@/api/data';
import SummaryScreen from '@/components/features/summaryScreen/SummaryScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import lottieStreak from '@/assets/lottie/streak.json';
import lottieTime from '@/assets/lottie/time.json';
import utils from '@/utils';
import loaderUi from '@/api/loaderUi';

class SummaryScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-summaryScreen-root';
  protected rootElClassName: string = 'swag-summaryScreen-root';

  async show (options: {
    stats: { key: string, value: string, lottie: object }[], 
    contentHtml: string, 
    shareString: string, 
    onFavorite?: () => void,
    onReplay?: () => void,
    onClose?: () => void,
  }) {
    loaderUi.show(350);

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
        const currentDay = await dataApi.getCurrentDay();
        return await dataApi.hasPlayedDay(currentDay.day);
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

    const [ 
      isMember, 
      isSubscriber, 
      hasPlayedToday,
      gameStreak,
      promoLinks
    ] = await Promise.all(promises) as [
      boolean, 
      boolean, 
      boolean, 
      DailyGameStreak, 
      GamePromoLink[]
    ];

    options.stats.unshift(
      {
        key: 'Streak',
        value: String(gameStreak.streak).padStart(3, '0'),
        lottie: lottieStreak
      }
    );
    
    // Add time stat if it exists
    const timeStat = options.stats.find(stat => stat.key.toLowerCase() === 'time');
    if (timeStat) {
      timeStat.lottie = lottieTime;
    }

    this.mount(<SummaryScreen 
      stats={options.stats} 
      contentHtml={options.contentHtml}
      promoLinks={(isMember && isSubscriber) ? promoLinks : promoLinks.slice(0, 4)}
      shareString={options.shareString}
      isMember={isMember}
      isSubscriber={isSubscriber}
      hasPlayedToday={hasPlayedToday}
      isInjected={this.isInjected}
      onFavorite={options.onFavorite}
      onReplay={() => {
        loaderUi.hide();

        this.unmount();
        if (options.onReplay) options.onReplay();
        if (options.onClose) options.onClose();
      }}
    />);

    loaderUi.hide();
  }

  protected onMount () {
    if (!this.isInjected) document.body.classList.add('swag-summaryScreen-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-summaryScreen-open');
  }
}

export default new SummaryScreenUI();
