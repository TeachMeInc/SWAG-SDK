import LeaderboardScreen from '@/components/features/leaderboardScreen/LeaderboardScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import dataApi from '@/api/data';
import loaderUi from '@/api/loaderUi';
import utils from '@/utils';
import session from '@/session';
import config from '@/config';

class LeaderboardScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-leaderboardScreen-root';
  protected rootElClassName: string = 'swag-leaderboardScreen-root';
  protected levelKey: string = '';

  setLevelKey (levelKey: string) {
    this.levelKey = levelKey;
  }

  async show (options: {
    onClickBack?: () => void;
    onClickPlay?: () => void;
    source?: 'splashScreen' | 'summaryScreen';
  }) {
    loaderUi.show(config.loaderDelay);
    
    await dataApi.getEntity(); // ensure entity is loaded

    let roomCode = utils.parseUrlOptions('leaderboard') as string;
    let leaderboardData = null;
    if (!roomCode) {
      roomCode = session.entity?.leaderboards?.[ 0 ] || '';
    }
    if (roomCode) {
      leaderboardData = await dataApi.getScores({
        level_key: this.levelKey,
        leaderboard: roomCode,
        day: utils.getDateString(),
        type: 'daily',
      });
    }

    loaderUi.hide();

    this.mount(
      <LeaderboardScreen
        levelKey={this.levelKey}
        initialRoomCode={roomCode || null}
        initialLeaderboardData={leaderboardData}
        onClickBack={options.onClickBack}
        onClickPlay={options.onClickPlay}
        source={options.source}
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
