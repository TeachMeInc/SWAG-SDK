import UserInterfaceAPI from '@/UserInterfaceAPI';
import Loader from '@/components/features/loader/Loader';
import utils from '@/utils';

class LoaderUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-loader-root';
  protected rootElClassName: string = 'swag-loader-root';

  async show (debounce?: number) {
    this.mount(<Loader />, debounce);
  }

  async hide () {
    const loaderEl = document.querySelector('.swag-loader');
    if (!loaderEl) return;
    loaderEl.classList.remove('--swag-loader-show');
    loaderEl.classList.add('--swag-loader-hide');
    await utils.wait(300); // wait for loader animation to finish
    this.unmount();
  }

  protected onMount () {
    document.body.classList.add('swag-loader-open');
  }

  protected onUnmount () {
    document.body.classList.remove('swag-loader-open');
  }
}

export default new LoaderUI();
