import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spin, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { PlayerProfileResponse } from "../types/players";
import OverallStats from "../components/player/OverallStats";
import MarketAnalysis from "../components/player/MarketAnalysis";

const { Title } = Typography;

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading } = useQuery<PlayerProfileResponse>({
    queryKey: ["player-profile", id],
    queryFn: () => apiFetch(API_ROUTES.playerProfile(id!)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container" style={{ color: "var(--muted-text)" }}>
        Player not found.
      </div>
    );
  }

  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 4 }}>
        {profile.player_name}
      </Title>
      <div style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        {profile.team_name ?? "Unknown Team"} · {profile.sport?.toUpperCase() ?? ""}
      </div>

      <div style={{ marginBottom: 40 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Overall Stats
        </Title>
        <OverallStats profile={profile} />
      </div>

      <MarketAnalysis markets={profile.markets} />
    </div>
  );
}
