import dataApi from '@/api/data';
import config from '@/config';
import session from '@/session';
import { DateString } from '@/types/DateString';
import utils from '@/utils';

class PrivateLeaderboardAPI {
  protected levelKey: string = '';
  protected pendingScore: { day: DateString, value: string, displayValue?: string } | null = null;
  protected cancelSendBeacon: (() => void) | null = null;

  setLevelKey (levelKey: string) {
    this.levelKey = levelKey;
  }

  getLevelKey () {
    return this.levelKey;
  }

  queueScore (day: DateString, value: string, displayValue?: string) {
    this.pendingScore = { day, value, displayValue };
    
    if (this.cancelSendBeacon) {
      this.cancelSendBeacon();
      this.cancelSendBeacon = null;
    }

    this.cancelSendBeacon = utils.sendBeacon(() => {
      const payload = { 
        game: session.apiKey, 
        level_key: this.levelKey, 
        value: this.pendingScore?.value,
        day: this.pendingScore?.day,
      };
      return { url: `${config.apiRoot}/v1/dailyscore`, payload };
    });
  }

  getPendingScore () {
    return this.pendingScore
      ? { ...this.pendingScore }
      : null;
  }

  async submitPendingScore () {
    if (!this.levelKey) {
      throw new Error('No level key set for private leaderboard API');
    }
    if (!this.pendingScore) {
      utils.warn('No pending score to submit');
      return;
    }

    if (this.cancelSendBeacon) {
      this.cancelSendBeacon();
      this.cancelSendBeacon = null;
    }

    await dataApi.postDailyScore(this.pendingScore.day, this.levelKey!, this.pendingScore.value);
    
    this.pendingScore = null;
  }
}

export default new PrivateLeaderboardAPI();
