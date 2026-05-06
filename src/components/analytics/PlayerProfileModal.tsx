import { Modal, Spin, Typography, Space, Grid } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { PlayerProfileResponse } from "./../../types/players";
import MarketSummaryTable from "./MarketSummaryTable";
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type Props = {
  playerId: number | null;
  onClose: () => void;
};

export default function PlayerProfileModal({ playerId, onClose }: Props) {
  const screens = useBreakpoint();
  const { data, isLoading } = useQuery<PlayerProfileResponse>({
    enabled: !!playerId,
    queryKey: ["player-profile", playerId],
    queryFn: () => apiFetch(API_ROUTES.playerProfile(playerId!)),
  });

return (
  <Modal
    open={!!playerId}
    onCancel={onClose}
    footer={null}
    width={screens.md ? 800 : "95vw"}
    wrapClassName="player-modal"
  >
    {isLoading || !data ? (
      <div className="player-modal-loading">
        <Spin />
      </div>
    ) : (
      <Space direction="vertical" size="large" className="player-modal-content">
        <Title level={4}>{data.player_name}</Title>

        <Text>
          Trust Score:{" "}
          {data.trust_score !== null
            ? `${(data.trust_score * 100).toFixed(1)}%`
            : "Insufficient data"}
        </Text>

        <Text type="secondary">
          {data.wins} / {data.overall.total_graded} graded ·{" "}
          {(Number(data.overall.win_rate) * 100).toFixed(1)}% win rate
        </Text>

        <MarketSummaryTable markets={data.markets} />
      </Space>
    )}
  </Modal>
);
}
