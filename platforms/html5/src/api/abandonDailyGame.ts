import config from '@/config';
import session from '@/session';
import utils from '@/utils';

class AbandonDailyGameAPI {
  protected cancelSend: (() => void) | null = null;

  queueEvent (getProperties: () => Record<string, any>) {
    if (this.cancelSend) {
      this.cancelSend();
      this.cancelSend = null;
    }
    
    this.cancelSend = utils.sendOnWindowClose(() => {
      const properties: Record<string, any> = {
        ...getProperties(),
        tag_name: 'level_abandoned',
        sdk_version: config.version,
        platform: utils.getPlatform(),
      };
      const gameMode = utils.getGameMode();
      if (gameMode) {
        properties.game_mode = gameMode;
      }
      
      const payload = {
        game: session.apiKey,
        properties,
      };

      return { url: `${config.apiRoot}/v1/user/tag`, payload };
    });
  }

  emptyQueue () {
    if (this.cancelSend) {
      this.cancelSend();
      this.cancelSend = null;
    }
  }
}

export default new AbandonDailyGameAPI();
