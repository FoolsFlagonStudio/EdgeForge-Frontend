export interface User {
  id: string;
  email: string;
  name: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  is_active: boolean;
  trust_score: number;
  wins: number;
  losses: number;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  trust_score: number | null;
  wins: number;
  losses: number;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  recent_picks: UserPickSummary[] | null;
  articles: ArticleSummary[] | null;
  specialties: string[];
}

export interface UserPickSummary {
  id: string;
  game_id: string;
  game_label: string;
  pick_type: string;
  reasoning: string | null;
  result: "win" | "loss" | "push" | null;
  created_at: string;
}

export interface ArticleSummary {
  id: string;
  title: string;
  subtitle: string | null;
  published_at: string | null;
  sport: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  display_name: string | null;
  trust_score: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_picks: number;
}

export interface SnapshotResponse {
  headline: {
    total_graded: number;
    overall_win_rate: number | null;
  };
  top_tier: {
    win_rate: number | null;
    total: number | null;
  } | null;
  today: {
    props: number;
    moneylines: number;
    props_by_sport: Record<string, number>;
  };
  recent_form: {
    wins: number;
    losses: number;
    win_rate: number | null;
  };
  current_streak: {
    result: string | null;
    length: number;
  };
}

export interface Subscription {
  status: "active" | "trialing" | "canceled" | "past_due" | null;
  plan_id: string | null;
  renews_at: string | null;
}

export interface MeResponse extends User {
  subscription: Subscription;
}
