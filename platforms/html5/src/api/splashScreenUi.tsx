import globalEventHandler, { GlobalEventType } from '@/api/globalEventHandler';
import loaderUi from '@/api/loaderUi';
import SplashScreen from '@/components/features/splashScreen/SplashScreen';
import config from '@/config';
import UserInterfaceAPI from '@/UserInterfaceAPI';

class SplashScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-splashScreen-root';
  protected rootElClassName: string = 'swag-splashScreen-root';

  async show (options: {
    isBeta?: boolean,
    onClickPlay?: () => void,
    hasLeaderboard?: boolean,
  }) {
    const onClickPlay = () => {
      globalEventHandler.dispatchEvent(new CustomEvent(GlobalEventType.SPLASH_SCREEN_CLICK_PLAY));
      options.onClickPlay?.();
    };

    this.mount(
      <SplashScreen 
        isBeta={options.isBeta} 
        onClickPlay={onClickPlay} 
        hasLeaderboard={options.hasLeaderboard} 
      />
    );
  }

  protected onMount () {
    document.body.classList.add('swag-panel--open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-panel--open');
  }
}

export default new SplashScreenUI();
