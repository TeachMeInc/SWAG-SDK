import data, { DailyGameStreak, GamePromoLink } from '@/api/data/data';
import { loaderUi } from '@/api/loader/loaderUi';
import SummaryScreen from '@/components/features/summaryScreen/SummaryScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import lottieStreak from '@/assets/lottie/streak.json';
import lottieTime from '@/assets/lottie/time.json';

class SummaryUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-summary-root';
  protected rootElClassName: string = 'swag-summary-root';
  private _isInjected: boolean = false;

  setRootElId (id: string) {
    super.setRootElId(id);
    this._isInjected = true;
  }

  async show (
    stats: { key: string, value: string, lottie: object }[], 
    contentHtml: string,
    shareString: string,
    onFavorite?: () => void,
    onReplay?: () => void,
    onClose?: () => void,
  ) {
    loaderUi.show(350);

    const promises = [];

    // Fetch member status
    promises.push((async () => {
      try {
        const getEntity = await data.getEntity();
        return getEntity.isMember;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error checking membership status:', e);
      }
    })());

    // Fetch subscriber status
    promises.push((async () => {
      try {
        return await data.isSubscriber();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error checking subscription status:', e);
      }
    })());

    // Check if the game has been played today
    promises.push((async () => {
      try {
        const currentDay = await data.getCurrentDay();
        return await data.hasPlayedDay(currentDay.day);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error checking if game has been played today:', e);
      }
    })());

    // Fetch daily game streak
    promises.push((async () => {
      let gameStreak: DailyGameStreak = { streak: 0, maxStreak: 0 };
      try {
        gameStreak = await data.getDailyGameStreak();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching game streak:', e);
      }
      return gameStreak;
    })());

    // Fetch promo links
    promises.push((async () => {
      try {
        return await data.getGamePromoLinks(6);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching promo links:', e);
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

    this.mount(<SummaryScreen 
      stats={stats} 
      contentHtml={contentHtml}
      promoLinks={(isMember && isSubscriber) ? promoLinks : promoLinks.slice(0, 4)}
      shareString={shareString}
      isMember={isMember}
      isSubscriber={isSubscriber}
      hasPlayedToday={hasPlayedToday}
      isInjected={this._isInjected}
      onFavorite={onFavorite}
      onReplay={() => {
        loaderUi.hide();

        this.unmount();
        if (onReplay) onReplay();
        if (onClose) onClose();
      }}
    />);

    loaderUi.hide();
  }

  protected onMount () {
    if (!this._isInjected) document.body.classList.add('swag-summary-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-summary-open');
  }
}

const summaryUi = new SummaryUI();
export default summaryUi;
