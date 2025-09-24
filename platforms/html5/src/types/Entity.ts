export interface Entity {
  _id: string;
  token: string;
  member?: {
    shockwave?: {
      screen_name: string;
      site_member_id: number;
      source: string;
      shockwave_logged_in: number;
    };
  };
  leaderboard_name: string;
  leaderboards: string[];
}
