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

  // MLB pitchers
  pitcher_strikeouts_alternate: "Pitcher Strikeouts",
  pitcher_outs_alternate: "Outs Recorded",
  pitcher_earned_runs_alternate: "Earned Runs",

  // NHL skaters
  player_shots_on_goal_alternate: "Shots on Goal",
  player_goals_alternate: "Goals",
  player_assists_alternate: "Assists",
  player_blocked_shots_alternate: "Blocked Shots",

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
