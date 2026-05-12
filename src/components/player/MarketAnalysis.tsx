import { Table, Typography } from "antd";
import type { PlayerProfileResponse } from "../../types/players";
import { formatMarketName } from "../../lib/markets";

const { Title } = Typography;

type Market = PlayerProfileResponse["markets"][number];
type LineBreakdown = Market["lines"][number];

interface Props {
  markets: PlayerProfileResponse["markets"];
}

function pct(v: number | string | null) {
  if (v == null) return "—";
  return `${(Number(v) * 100).toFixed(1)}%`;
}

const lineColumns = [
  {
    title: "Line",
    dataIndex: "display",
    render: (v: string) => <span style={{ paddingLeft: 16 }}>{v}</span>,
  },
  {
    title: "Win Rate",
    dataIndex: "win_rate",
    render: (v: number | string) => pct(v),
  },
  { title: "Graded", dataIndex: "total" },
  { title: "Wins", dataIndex: "wins" },
];

export default function MarketAnalysis({ markets }: Props) {
  if (markets.length === 0) {
    return <div style={{ color: "var(--muted-text)" }}>No market data available.</div>;
  }

  const columns = [
    { title: "Market", dataIndex: "market", render: (m: string) => formatMarketName(m) },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      sorter: (a: Market, b: Market) => a.win_rate - b.win_rate,
      render: (v: number) => pct(v),
    },
    { title: "Graded", dataIndex: "total_graded" },
    { title: "Wins", dataIndex: "wins" },
    {
      title: "Avg Line",
      dataIndex: "avg_line",
      render: (v: number | null) => (v != null ? v.toFixed(1) : "—"),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        Market Analysis
      </Title>
      <div className="dashboard-table">
        <Table<Market>
          columns={columns}
          dataSource={markets}
          rowKey="market"
          size="small"
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) =>
              record.lines.length > 0 ? (
                <Table<LineBreakdown>
                  columns={lineColumns}
                  dataSource={record.lines}
                  rowKey="line"
                  size="small"
                  pagination={false}
                  showHeader={true}
                  style={{ margin: "0 0 8px 24px" }}
                />
              ) : (
                <span style={{ color: "var(--muted-text)", paddingLeft: 24 }}>
                  No line breakdown available.
                </span>
              ),
            rowExpandable: (record) => record.lines.length > 0,
          }}
        />
      </div>
    </div>
  );
}
