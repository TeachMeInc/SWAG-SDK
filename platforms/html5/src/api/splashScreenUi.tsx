import SplashScreen from '@/components/features/splashScreen/SplashScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';

class SplashScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-splashScreen-root';
  protected rootElClassName: string = 'swag-splashScreen-root';

  async show () {
    this.mount(<SplashScreen />);
  }

  protected onMount () {
    document.body.classList.add('swag-splashScreen-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-splashScreen-open');
  }
}

export default new SplashScreenUI();
