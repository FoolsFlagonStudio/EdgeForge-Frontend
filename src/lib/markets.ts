const MARKET_NAMES: Record<string, string> = {
  // NBA base
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  threes: "3-Pointers",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",

  // NBA combo (stored with player_ prefix in DB)
  player_points_rebounds_assists_alternate: "Pts + Reb + Ast",
  player_points_assists_alternate: "Pts + Ast",
  player_points_rebounds_alternate: "Pts + Reb",
  player_rebounds_assists_alternate: "Reb + Ast",

  // MLB batters
  batter_hits_alternate: "Hits",
  batter_total_bases_alternate: "Total Bases",
  batter_rbis_alternate: "RBIs",
  batter_runs_alternate: "Runs",
  batter_home_runs_alternate: "Home Runs",
  batter_hits_runs_rbis_alternate: "H + R + RBI",
  batter_strikeouts_alternate: "Batter Strikeouts",
  batter_runs_scored_alternate: "Runs Scored",
  batter_singles_alternate: "Singles",
  batter_doubles_alternate: "Doubles",
  batter_triples_alternate: "Triples",
  batter_walks_alternate: "Walks",
  batter_stolen_bases_alternate: "Stolen Bases",

  // MLB pitchers
  pitcher_strikeouts_alternate: "Pitcher Strikeouts",
  pitcher_outs_alternate: "Outs Recorded",
  pitcher_earned_runs_alternate: "Earned Runs",
  pitcher_hits_allowed_alternate: "Hits Allowed",
  pitcher_walks_alternate: "Walks Allowed",

  // NHL skaters
  player_shots_on_goal_alternate: "Shots on Goal",
  player_goals_alternate: "Goals",
  player_assists_alternate: "Assists",
  player_blocked_shots_alternate: "Blocked Shots",
  player_points_alternate: "Points",
  player_power_play_points_alternate: "Power Play Points",

  // NHL goalies
  player_total_saves_alternate: "Saves",
};

export function formatMarketName(market: string): string {
  if (MARKET_NAMES[market]) return MARKET_NAMES[market];
  return market
    .replace(/_alternate$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface MarketOption {
  value: string;
  label: string;
  sport: string;
}

export const ALL_MARKETS: MarketOption[] = [
  // NBA
  { value: "points", label: "Points", sport: "NBA" },
  { value: "rebounds", label: "Rebounds", sport: "NBA" },
  { value: "assists", label: "Assists", sport: "NBA" },
  { value: "threes", label: "3-Pointers", sport: "NBA" },
  { value: "steals", label: "Steals", sport: "NBA" },
  { value: "blocks", label: "Blocks", sport: "NBA" },
  { value: "turnovers", label: "Turnovers", sport: "NBA" },
  { value: "player_points_rebounds_assists_alternate", label: "Pts + Reb + Ast", sport: "NBA" },
  { value: "player_points_assists_alternate", label: "Pts + Ast", sport: "NBA" },
  { value: "player_points_rebounds_alternate", label: "Pts + Reb", sport: "NBA" },
  { value: "player_rebounds_assists_alternate", label: "Reb + Ast", sport: "NBA" },
  // MLB batters
  { value: "batter_hits_alternate", label: "Hits", sport: "MLB" },
  { value: "batter_total_bases_alternate", label: "Total Bases", sport: "MLB" },
  { value: "batter_rbis_alternate", label: "RBIs", sport: "MLB" },
  { value: "batter_home_runs_alternate", label: "Home Runs", sport: "MLB" },
  { value: "batter_runs_scored_alternate", label: "Runs Scored", sport: "MLB" },
  { value: "batter_singles_alternate", label: "Singles", sport: "MLB" },
  { value: "batter_doubles_alternate", label: "Doubles", sport: "MLB" },
  { value: "batter_triples_alternate", label: "Triples", sport: "MLB" },
  { value: "batter_walks_alternate", label: "Walks", sport: "MLB" },
  { value: "batter_strikeouts_alternate", label: "Batter Strikeouts", sport: "MLB" },
  { value: "batter_stolen_bases_alternate", label: "Stolen Bases", sport: "MLB" },
  { value: "batter_hits_runs_rbis_alternate", label: "H + R + RBI", sport: "MLB" },
  // MLB pitchers
  { value: "pitcher_strikeouts_alternate", label: "Pitcher Strikeouts", sport: "MLB" },
  { value: "pitcher_outs_alternate", label: "Outs Recorded", sport: "MLB" },
  { value: "pitcher_earned_runs_alternate", label: "Earned Runs", sport: "MLB" },
  { value: "pitcher_hits_allowed_alternate", label: "Hits Allowed", sport: "MLB" },
  { value: "pitcher_walks_alternate", label: "Walks Allowed", sport: "MLB" },
  // NHL skaters
  { value: "player_shots_on_goal_alternate", label: "Shots on Goal", sport: "NHL" },
  { value: "player_goals_alternate", label: "Goals", sport: "NHL" },
  { value: "player_assists_alternate", label: "Assists", sport: "NHL" },
  { value: "player_blocked_shots_alternate", label: "Blocked Shots", sport: "NHL" },
  { value: "player_points_alternate", label: "Points", sport: "NHL" },
  { value: "player_power_play_points_alternate", label: "Power Play Points", sport: "NHL" },
  // NHL goalies
  { value: "player_total_saves_alternate", label: "Saves", sport: "NHL" },
];
