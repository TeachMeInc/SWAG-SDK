export interface Entity {
  _id: string;
  token: string;
  member?: {
    shockwave: {
      screen_name: string;
      site_member_id: string;
    }
  };
  leaderboard_name: string;
  leaderboards: string[];
}
