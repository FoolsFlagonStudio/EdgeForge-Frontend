import { Typography, Space, Spin, Alert, Card, Table, Progress } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./../../lib/api";
import { API_ROUTES } from "./../../lib/routes";

import ConfidencePerformanceTable from "./ConfidencePerformanceTable";
import MarketConfidenceTable from "./MarketConfidenceTable";

type BySportRow = {
  sport: string;
  total: number;
  wins: number;
  win_rate: string;
};

type HistoricalAnalytics = {
  overall: {
    wins: number;
    losses: number;
    total: number;
    voided: number;
    win_rate: string;
  } | null;

  confidence: {
    confidence: number;
    wins: number;
    losses: number;
    voids: number;
    total: number;
    win_rate: string;
  }[];

  confidence_weighted: string | null;
  confidence_weighted_base: string | null;
  confidence_weighted_combo: string | null;

  markets: {
    market: string;
    wins: number;
    losses: number;
    total: number;
    voids: number;
    win_rate: string;
  }[];

  market_confidence: {
    market: string;
    market_group: string;
    confidence: number;
    wins: number;
    total: number;
    win_rate: string;
    low_sample: boolean;
  }[];

  by_sport: BySportRow[];
};

const sportColumns = [
  { title: "Sport", dataIndex: "sport", key: "sport" },
  {
    title: "Record",
    key: "record",
    render: (_: any, r: BySportRow) => `${r.wins} / ${r.total}`,
  },
  {
    title: "Win Rate",
    key: "win_rate",
    render: (_: any, r: BySportRow) => (
      <Progress
        className="progress-bar"
        percent={Number((Number(r.win_rate) * 100).toFixed(1))}
        size="small"
      />
    ),
  },
];

const { Title, Text } = Typography;

export default function HistoricalOverview() {
  const { data, isLoading, error } = useQuery<HistoricalAnalytics>({
    queryKey: ["historical-analytics"],
    queryFn: () => apiFetch(API_ROUTES.historicalAnalytics),
    staleTime: 15 * 60 * 1000,
  });

  if (isLoading) return <Spin />;
  if (error || !data) {
    return <Alert type="error" message="Failed to load historical analytics" />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3}>Historical Performance</Title>

      <ConfidencePerformanceTable data={data.confidence ?? []} />

      <MarketConfidenceTable data={data.market_confidence ?? []} />

      {(data.by_sport?.length ?? 0) > 0 && (
        <Card title="Performance by Sport">
          <Table
            className="dashboard-table"
            dataSource={data.by_sport}
            columns={sportColumns}
            rowKey="sport"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      <Text type="secondary" style={{ fontSize: 12 }}>
        All historical analytics are based on resolved bets only. Player props
        shown here reflect straight bets only.
      </Text>
    </Space>
  );
}
