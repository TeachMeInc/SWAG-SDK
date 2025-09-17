import InviteFriendsScreen from '@/components/features/inviteFriendsScreen/InviteFriendsScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import dataApi from '@/api/data';
import utils from '@/utils';
import loaderUi from '@/api/loaderUi';

class InviteFriendsScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-inviteFriendsScreen-root';
  protected rootElClassName: string = 'swag-inviteFriendsScreen-root';

  async show (options: {
    onClickBack?: () => void;
  }) {
    let roomCode = utils.parseUrlOptions('leaderboard') as string;
    if (!roomCode) {
      loaderUi.show(350);
      roomCode = (await dataApi.postLeaderboardCodeAllocate()).code;

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('leaderboard', roomCode);
      window.history.replaceState({}, '', newUrl.toString());

      loaderUi.hide();
    }
    
    this.mount(
      <InviteFriendsScreen 
        roomCode={roomCode}
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
