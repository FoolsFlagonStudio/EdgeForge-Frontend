export interface Team {
  id: string;
  team_name: string;
  abbreviation: string;
  logo: string | null;
  conference: string | null;
}

export interface Sport {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  sport: Sport;
  home_team: Team;
  away_team: Team;
  date: string;
  status: "scheduled" | "in_progress" | "final";
  final_score_home: number | null;
  final_score_away: number | null;
  straight_count: number;
  parlay_count: number;
  user_pick_count: number;
}

export interface GameDetail extends Game {
  moneyline: Moneyline | null;
  picks: GamePick[];
  straights: Straight[];
}

export interface Moneyline {
  id: string;
  game_id: string;
  pick: string;
  implied_prob: number;
  model_prob: number;
  edge: number;
  pick_odds: number;
  result: "win" | "loss" | "push" | null;
}

export interface Straight {
  id: string;
  player_name: string;
  team_name: string;
  market: string;
  line: number;
  comparator: "over" | "under";
  odds: number;
  confidence: number;
  hit_rate_last_5: number | null;
  score: number;
  risk_profile: "core" | "strong" | "acceptable" | "weak" | "speculative";
  result: "win" | "loss" | "push" | null;
  is_free: boolean;
}

export interface GamePick {
  id: string;
  user: {
    id: string;
    display_name: string | null;
    trust_score: number;
  };
  pick_type: "straight" | "moneyline";
  reasoning: string | null;
  result: "win" | "loss" | "push" | null;
  created_at: string;
}

export interface SportAnalytics {
  sport: string;
  total_graded: number;
  win_rate: number;
  by_market: Array<{
    market: string;
    total: number;
    wins: number;
    win_rate: number;
  }>;
  by_risk: Array<{
    risk_profile: string;
    total: number;
    wins: number;
    win_rate: number;
  }>;
}
