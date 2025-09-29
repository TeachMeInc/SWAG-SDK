import config from '@/config';
import session from '@/session';
import utils from '@/utils';

class AbandonDailyGameAPI {
  protected getProperties: (() => Record<string, any>) | null = null;
  protected eventListener: (() => void) | null = null;

  queueEvent (getProperties: () => Record<string, any>) {
    this.getProperties = getProperties;

    if (this.eventListener) {
      document.removeEventListener('visibilitychange', this.eventListener);
    }

    this.eventListener = () => {
      if (document.visibilityState === 'hidden') {
        const payload = {
          game: session.game?.shockwave_keyword,
          properties: {
            ...getProperties(),
            tag_name: 'level_abandoned',
            sdk_version: config.version,
            platform: utils.getPlatform(),
          },
        };
        navigator.sendBeacon(
          `${config.apiRoot}/v1/user/tag`, 
          new Blob([ JSON.stringify(payload) ], { type: 'application/json' })
        );
      }
    };

    document.addEventListener('visibilitychange', this.eventListener);
  }

  emptyQueue () {
    if (this.eventListener) {
      document.removeEventListener('visibilitychange', this.eventListener);
      this.eventListener = null;
    }
    this.getProperties = null;
  }
}

export default new AbandonDailyGameAPI();
