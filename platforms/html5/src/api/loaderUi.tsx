import UserInterfaceAPI from '@/UserInterfaceAPI';
import Loader from '@/components/features/loader/Loader';

class LoaderUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-loader-root';
  protected rootElClassName: string = 'swag-loader-root';

  async show (debounce?: number) {
    this.mount(<Loader />, debounce);
  }

  protected onMount () {
    document.body.classList.add('swag-loader-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-loader-open');
  }
}

export default new LoaderUI();
