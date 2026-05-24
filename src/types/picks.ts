export interface FreePick {
  id: string;
  pickable_id: string;
  pickable_type: "straight" | "moneyline";
  date: string;
  straight?: {
    player_name: string;
    market: string;
    line: number;
    comparator: "over" | "under";
    odds: number;
    confidence: number;
    risk_profile: string;
    result: "win" | "loss" | "push" | null;
  };
  moneyline?: {
    pick: string;
    implied_prob: number;
    model_prob: number;
    edge: number;
    pick_odds: number;
    result: "win" | "loss" | "push" | null;
  };
  game: {
    id: string;
    home_team: string;
    away_team: string;
    date: string;
  };
}

export interface UserPickPayload {
  game_id: string;
  pickable_id: string;
  pickable_type: "straight" | "moneyline";
  reasoning?: string;
}
