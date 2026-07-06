export const API_ROUTES = {
  // Public
  snapshot: "/api/public/snapshot",
  freePicks: (date: string) => `/api/free-picks?date=${date}`,
  todaysBets: "/api/public/bets/today",
  upcomingGames: "/api/games/upcoming",

  // Games
  gamesBySpot: (sport: string) => `/api/games?sport=${sport}`,
  gameDetail: (id: string) => `/api/games/${id}`,
  gameParlays: (id: string) => `/api/games/${id}/parlays`,

  // Sports
  sportAnalytics: (sportId: string) => `/api/sports/${sportId}/analytics`,

  // Players — callable form for backwards-compat with v1 analytics components
  players: () => "/api/public/players",
  playersSearch: "/api/public/players/search",
  playerSearch: "/api/public/players/search",
  playerProfile: (id: string | number) => `/api/public/players/${id}/profile`,

  // Articles
  articles: "/api/articles",
  articleDetail: (id: string) => `/api/articles/${id}`,

  // Promos
  promos: "/api/public/promos",

  // Feedback
  feedback: "/api/feedback",

  // User picks
  submitPick: "/api/picks",
  submitParlay: "/api/picks/parlays",
  myPicks: "/api/picks",

  // Users
  userProfile: (id: string) => `/api/users/${id}`,
  followUser: (id: string) => `/api/users/${id}/follow`,
  leaderboard: "/api/leaderboard",

  // Auth / Billing
  me: "/api/me",
  billingCheckout: "/api/billing/checkout",
  billingPortal: "/api/billing/portal",
  startTrial: "/api/billing/trial/start",

  // Analytics — v1 key names (used by copied analytics components)
  historicalAnalytics: "/api/public/historical/analytics",
  moneylineEdgeBuckets: "/api/analytics/moneylines/edge-buckets",
  moneylineCalibration: "/api/analytics/moneylines/calibration",
  moneylineBySport: "/api/analytics/moneylines/by-sport",
  runlineEdgeBuckets: "/api/analytics/runlines/edge-buckets",
  totalsEdgeBuckets: "/api/analytics/totals/edge-buckets",
  modelTrust: "/api/analytics/model-trust",
  parlayAnalytics: "/api/analytics/parlays",
  propsBySport: "/api/analytics/props/by-sport",
  rolling: (days: number, sport?: string) =>
    `/api/analytics/rolling?days=${days}${sport ? `&sport=${sport}` : ""}`,
  roi: (sport?: string) =>
    `/api/analytics/roi${sport ? `?sport=${sport}` : ""}`,
  topPlayers: (days: number, minSamples?: number, sport?: string) => {
    const params = new URLSearchParams({ days: String(days) });
    if (minSamples != null) params.set("min_samples", String(minSamples));
    if (sport) params.set("sport", sport);
    return `/api/analytics/top-players?${params.toString()}`;
  },
};
