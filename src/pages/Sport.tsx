import { useQuery } from "@tanstack/react-query";
import { Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { Game, SportAnalytics } from "../types/games";
import TodaysGames from "../components/sport/TodaysGames";
import SportStats from "../components/sport/SportStats";
import PlayersSection from "../components/sport/PlayersSection";

const { Title } = Typography;

const SPORT_IDS: Record<string, string> = {
  nba: "nba",
  nhl: "nhl",
  mlb: "mlb",
  wnba: "wnba",
};

interface Props {
  sport: "nba" | "nhl" | "mlb" | "wnba";
}

export default function Sport({ sport }: Props) {
  const sportId = SPORT_IDS[sport];

  const { data: games = [], isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["games", sport],
    queryFn: () => apiFetch(API_ROUTES.gamesBySpot(sport)),
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<SportAnalytics>({
    queryKey: ["sport-analytics", sportId],
    queryFn: () => apiFetch(API_ROUTES.sportAnalytics(sportId)),
  });

  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 32 }}>
        {sport.toUpperCase()}
      </Title>

      <div style={{ marginBottom: 48 }}>
        <TodaysGames games={games} loading={gamesLoading} />
      </div>

      <div style={{ marginBottom: 48 }}>
        <SportStats analytics={analytics} loading={analyticsLoading} />
      </div>

      <div>
        <Title level={3} style={{ marginBottom: 20 }}>
          Players
        </Title>
        <PlayersSection sport={sport} />
      </div>
    </div>
  );
}
