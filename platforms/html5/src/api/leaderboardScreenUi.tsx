import LeaderboardScreen from '@/components/features/leaderboardScreen/LeaderboardScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import dataApi from '@/api/data';
import loaderUi from '@/api/loaderUi';
import utils from '@/utils';
import session from '@/session';

class LeaderboardScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-leaderboardScreen-root';
  protected rootElClassName: string = 'swag-leaderboardScreen-root';

  async show (options: {
    onClickBack?: () => void;
  }) {
    loaderUi.show(350);
    
    await dataApi.getEntity(); // ensure entity is loaded

    let roomCode = utils.parseUrlOptions('leaderboard') as string;
    let leaderboardData = null;
    if (!roomCode) {
      roomCode = session.entity?.leaderboards?.[ 0 ] || '';
    }
    if (roomCode) {
      leaderboardData = await dataApi.getScores({
        level_key: 'daily',
        leaderboard: roomCode,
      });
    }

    loaderUi.hide();

    this.mount(
      <LeaderboardScreen
        initialRoomCode={roomCode || null}
        initialLeaderboardData={leaderboardData}
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

export default new LeaderboardScreenUI();
