import { Table, Spin, Alert, Statistic, Row, Col, Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import { winRateTag } from "../../lib/pickTags";

type ByLegsRow = {
  leg_count: number;
  total: number;
  wins: number;
  losses: number;
  win_rate: number | null;
  avg_odds: number | null;
};

type ParlayAnalyticsResponse = {
  overall: {
    total: number;
    wins: number;
    losses: number;
    win_rate: number | null;
    avg_odds: number | null;
  } | null;
  by_legs: ByLegsRow[];
};

export default function ParlayAnalyticsTable() {
  const { data, isLoading, error } = useQuery<ParlayAnalyticsResponse>({
    queryKey: ["parlay-analytics"],
    queryFn: () => apiFetch(API_ROUTES.parlayAnalytics),
  });

  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" message="Failed to load parlay analytics" />;
  if (!data?.overall || data.overall.total === 0) {
    return <p style={{ color: "var(--text-secondary)" }}>No graded parlays yet.</p>;
  }

  const { overall } = data;

  const columns = [
    { title: "Legs", dataIndex: "leg_count", key: "leg_count" },
    {
      title: "Win Rate",
      key: "win_rate",
      render: (_: any, r: ByLegsRow) =>
        r.win_rate != null ? winRateTag(r.win_rate) : "—",
    },
    {
      title: "Record",
      key: "record",
      render: (_: any, r: ByLegsRow) => `${r.wins}W — ${r.losses}L`,
    },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Avg Odds (dec)",
      key: "avg_odds",
      render: (_: any, r: ByLegsRow) =>
        r.avg_odds != null ? r.avg_odds.toFixed(2) + "×" : "—",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Total Graded" value={overall.total} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Win Rate"
              value={overall.win_rate != null ? (overall.win_rate * 100).toFixed(1) + "%" : "—"}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Wins" value={overall.wins} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Losses" value={overall.losses} />
          </Card>
        </Col>
      </Row>

      {data.by_legs.length > 0 && (
        <Table
          className="dashboard-table"
          dataSource={data.by_legs}
          columns={columns}
          rowKey="leg_count"
          pagination={false}
          size="small"
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
