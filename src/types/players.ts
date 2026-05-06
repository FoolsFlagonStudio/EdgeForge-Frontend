export interface PlayerListItem {
  id: string;
  player_name: string;
  team_name: string;
  sport: string;
  trust_score?: number | null;
  wins: number;
  losses?: number;
  win_rate: number | null;
  total_graded: number;
}

export interface PlayerProfileResponse {
  player_id: string;
  player_name: string;
  team_name: string | null;
  sport: string;
  trust_score: number | null;
  wins: number;
  losses: number;
  overall: {
    total_graded: number;
    win_rate: number | null;
    avg_confidence: number | null;
  };
  markets: Array<{
    market: string;
    total_graded: number;
    wins: number;
    win_rate: number;
    avg_line: number;
    lines: Array<{
      line: number;
      comparator: string;
      total: number;
      wins: number;
      win_rate: number;
    }>;
  }>;
}
