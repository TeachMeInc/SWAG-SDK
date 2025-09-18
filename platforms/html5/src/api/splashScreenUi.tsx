import SplashScreen from '@/components/features/splashScreen/SplashScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';

class SplashScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-splashScreen-root';
  protected rootElClassName: string = 'swag-splashScreen-root';

  async show (options: {
    isBeta?: boolean,
    onClickPlay?: () => void,
  }) {
    this.mount(
      <SplashScreen 
        isBeta={options.isBeta} 
        onClickPlay={options.onClickPlay} 
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
