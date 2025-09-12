import SplashScreen from '@/components/features/splashScreen/SplashScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';

class SplashScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-splash-screen-root';
  protected rootElClassName: string = 'swag-splash-screen-root';

  async show () {
    this.mount(<SplashScreen />);
  }

  protected onMount () {
    document.body.classList.add('swag-splash-screen-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-splash-screen-open');
  }
}

export default new SplashScreenUI();
