import globalEventHandler, { GlobalEventType } from '@/api/globalEventHandler';
import SplashScreen from '@/components/features/splashScreen/SplashScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import loaderUi from '@/api/loaderUi';

class SplashScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-splashScreen-root';
  protected rootElClassName: string = 'swag-splashScreen-root';

  async show (options: {
    isBeta?: boolean,
    hasLeaderboard?: boolean,
    onClickPlay?: () => void,
    waitForAssets?: Promise<void>,
  }) {
    if (options.waitForAssets) {
      loaderUi.show();
    }
    
    const onClickPlay = () => {
      globalEventHandler.dispatchEvent(new CustomEvent(GlobalEventType.SPLASH_SCREEN_CLICK_PLAY));
      options.onClickPlay?.();
    };

    this.mount(
      <SplashScreen 
        isBeta={options.isBeta} 
        onClickPlay={onClickPlay} 
        hasLeaderboard={options.hasLeaderboard} 
        waitForAssets={options.waitForAssets}
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
