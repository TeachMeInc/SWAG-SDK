import dataApi from '@/api/data';

class PrivateLeaderboardAPI {
  protected levelKey: string | null = null;
  protected pendingScore: { value: string, displayValue?: string } | null = null;

  setLevelKey (levelKey: string) {
    this.levelKey = levelKey;
  }

  queueScore (value: string, displayValue?: string) {
    this.pendingScore = { value, displayValue };
  }

  getPendingScore () {
    return this.pendingScore
      ? { ...this.pendingScore }
      : null;
  }

  async submitPendingScore (code: string) {
    if (!this.levelKey) {
      throw new Error('No level key set for private leaderboard API');
    }
    if (!this.pendingScore) {
      throw new Error('No pending score to submit for private leaderboard API');
    }
    await dataApi.postScore(this.levelKey!, this.pendingScore.value, {
      leaderboard: code,
    });
    this.pendingScore = null;
  }
}

export default new PrivateLeaderboardAPI();
