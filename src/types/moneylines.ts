export type MoneylineBySportRow = {
  sport: string;
  total: number;
  wins: number;
  win_rate: number;
};

export type SnapshotResponse = {
  headline: {
    total_graded: number;
    overall_win_rate: number;
  };
  today: {
    props_available: number;
    props_by_sport: Record<string, number>;
    moneylines_available: number;
  };
  top_tier: {
    confidence: number;
    label: string;
    total: number;
    win_rate: number;
  };
  recent_form: {
    days: number;
    wins: number;
    losses: number;
    win_rate: number;
  };
  current_streak: {
    result: "win" | "loss";
    length: number;
  };
  props_by_sport: {
    sport: string;
    total: number;
    win_rate: number;
  }[];
};
