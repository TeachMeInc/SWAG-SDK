import InviteFriendsScreen from '@/components/features/inviteFriendsScreen/InviteFriendsScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';

class InviteFriendsScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-inviteFriendsScreen-root';
  protected rootElClassName: string = 'swag-inviteFriendsScreen-root';

  async show (options: {
    onClickBack?: () => void;
  }) {
    this.mount(
      <InviteFriendsScreen 
        onClickBack={options.onClickBack}
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

export default new InviteFriendsScreenUI();
