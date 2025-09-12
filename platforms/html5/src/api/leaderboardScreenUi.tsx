import LeaderboardScreen from '@/components/features/leaderboardScreen/LeaderboardScreen';
import UserInterfaceAPI from '@/UserInterfaceAPI';

class LeaderboardScreenUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-leaderboardScreen-root';
  protected rootElClassName: string = 'swag-leaderboardScreen-root';

  async show (options: {
    onClickBack?: () => void;
  }) {
    this.mount(
      <LeaderboardScreen 
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
