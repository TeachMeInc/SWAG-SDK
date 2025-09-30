import config from '@/config';
import session from '@/session';
import utils from '@/utils';

class AbandonDailyGameAPI {
  protected cancelSendBeacon: (() => void) | null = null;

  queueEvent (getProperties: () => Record<string, any>) {
    if (this.cancelSendBeacon) {
      this.cancelSendBeacon();
      this.cancelSendBeacon = null;
    }
    
    this.cancelSendBeacon = utils.sendBeacon(() => {
      const payload = {
        game: session.game?.shockwave_keyword,
        properties: {
          ...getProperties(),
          tag_name: 'level_abandoned',
          sdk_version: config.version,
          platform: utils.getPlatform(),
        },
      };

      return { url: `${config.apiRoot}/v1/user/tag`, payload };
    });
  }

  emptyQueue () {
    if (this.cancelSendBeacon) {
      this.cancelSendBeacon();
      this.cancelSendBeacon = null;
    }
  }
}

export default new AbandonDailyGameAPI();
