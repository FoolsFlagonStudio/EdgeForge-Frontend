export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  body: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  sport: string | null;
  author: {
    id: string;
    display_name: string | null;
    trust_score: number;
  };
  games: ArticleGame[];
  picks: ArticlePick[];
}

export interface ArticleListItem {
  id: string;
  title: string;
  subtitle: string | null;
  body: string | null | undefined;
  published_at: string | null;
  sport: string | null;
  author: {
    id: string;
    display_name: string | null;
  };
}

export interface ArticleGame {
  game_id: string;
  home_team: string;
  away_team: string;
  date: string;
}

export interface ArticlePick {
  pickable_id: string;
  pickable_type: "straight" | "moneyline";
  player_name?: string;
  market?: string;
  line?: number;
  comparator?: string;
}

export interface ArticleCreatePayload {
  title: string;
  subtitle?: string;
  body: string;
  published: boolean;
  sport_id?: string;
  game_ids?: string[];
}
