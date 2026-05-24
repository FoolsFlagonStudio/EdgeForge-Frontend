import { useQuery } from "@tanstack/react-query";
import { Card, List, Tag, Typography } from "antd";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

const { Text } = Typography;

interface ParlayLeg {
  game_id: number;
  pickable_type: string;
  display?: string;
  result?: string | null;
}

interface Parlay {
  id: string;
  total_odds: number | null;
  result: string | null;
  legs: ParlayLeg[];
}

function resultTag(result: string | null) {
  if (!result) return <Tag>Pending</Tag>;
  if (result === "win") return <Tag color="green">Win</Tag>;
  if (result === "loss") return <Tag color="red">Loss</Tag>;
  if (result === "void") return <Tag color="orange">Void</Tag>;
  return <Tag>{result}</Tag>;
}

function legResultTag(result: string | null | undefined) {
  if (!result) return null;
  if (result === "win") return <Tag color="green" style={{ marginLeft: 4 }}>W</Tag>;
  if (result === "loss") return <Tag color="red" style={{ marginLeft: 4 }}>L</Tag>;
  if (result === "void") return <Tag color="orange" style={{ marginLeft: 4 }}>Void</Tag>;
  return null;
}

interface Props {
  gameId: string;
}

export default function ParlayList({ gameId }: Props) {
  const { data, isLoading } = useQuery<Parlay[]>({
    queryKey: ["parlays", gameId],
    queryFn: () => apiFetch(API_ROUTES.gameParlays(gameId)),
  });

  if (isLoading) return <Text type="secondary">Loading parlays…</Text>;
  if (!data || data.length === 0) return <Text type="secondary">No system parlays for this game.</Text>;

  return (
    <List
      dataSource={data}
      renderItem={(parlay) => (
        <List.Item style={{ padding: "8px 0" }}>
          <Card
            size="small"
            style={{ width: "100%" }}
            title={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {resultTag(parlay.result)}
                {parlay.total_odds != null && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {parlay.total_odds.toFixed(2)}x odds
                  </Text>
                )}
              </span>
            }
          >
            <List
              size="small"
              dataSource={parlay.legs}
              renderItem={(leg) => (
                <List.Item style={{ padding: "2px 0" }}>
                  <Text style={{ fontSize: 13 }}>
                    {leg.display ?? `${leg.pickable_type} #${leg.game_id}`}
                  </Text>
                  {legResultTag(leg.result)}
                </List.Item>
              )}
            />
          </Card>
        </List.Item>
      )}
    />
  );
}
