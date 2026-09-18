import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { GameDetail as GameDetailType } from "../types/games";
import MoneylineProjection from "../components/game/MoneylineProjection";
import RunlineProjection from "../components/game/RunlineProjection";
import TotalProjection from "../components/game/TotalProjection";
import GamePicks from "../components/game/GamePicks";

const { Title } = Typography;

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: game, isLoading } = useQuery<GameDetailType>({
    queryKey: ["game", id],
    queryFn: () => apiFetch(API_ROUTES.gameDetail(id!)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="page-container" style={{ color: "var(--muted-text)" }}>
        Game not found.
      </div>
    );
  }

  const gameDate = new Date(game.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusColor: Record<string, string> = {
    scheduled: "blue",
    in_progress: "orange",
    final: "default",
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 8 }}>
        <Tag color={statusColor[game.status] ?? "default"} style={{ textTransform: "capitalize" }}>
          {game.status.replace("_", " ")}
        </Tag>
      </div>
      <Title level={1} style={{ marginBottom: 4 }}>
        {game.away_team.team_name} @ {game.home_team.team_name}
      </Title>
      <div style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        {game.sport.name.toUpperCase()} · {gameDate}
      </div>

      {game.moneyline && <MoneylineProjection moneyline={game.moneyline} />}
      {game.runline && <RunlineProjection runline={game.runline} />}
      {game.total && <TotalProjection total={game.total} />}

      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Picks
        </Title>
        <GamePicks picks={game.straights ?? []} />
      </div>
    </div>
  );
}
