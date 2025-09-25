import dataApi from '@/api/data';
import config from '@/config';
import session from '@/session';
import { DateString } from '@/types/DateString';
import utils from '@/utils';

class PrivateLeaderboardAPI {
  protected levelKey: string | null = null;
  protected pendingScore: { day: DateString, value: string, displayValue?: string } | null = null;
  protected eventListener: (() => void) | null = null;

  setLevelKey (levelKey: string) {
    this.levelKey = levelKey;
  }

  getLevelKey () {
    return this.levelKey;
  }

  queueScore (day: DateString, value: string, displayValue?: string) {
    this.pendingScore = { day, value, displayValue };

    if (this.eventListener) {
      document.removeEventListener('visibilitychange', this.eventListener);
    }

    this.eventListener = () => {
      if (document.visibilityState === 'hidden') {
        const payload = { 
          game: session.apiKey, 
          level_key: this.levelKey, 
          value: this.pendingScore?.value,
          day: this.pendingScore?.day,
        };
        navigator.sendBeacon(
          `${config.apiRoot}/v1/dailyscore`, 
          new Blob([ JSON.stringify(payload) ], { type: 'application/json' })
        );
      }
    };

    document.addEventListener('visibilitychange', this.eventListener);
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

    await dataApi.postDailyScore(this.pendingScore.day, this.levelKey!, this.pendingScore.value);

    if (this.eventListener) {
      document.removeEventListener('visibilitychange', this.eventListener);
      this.eventListener = null;
    }
    this.pendingScore = null;
  }
}

export default new PrivateLeaderboardAPI();
