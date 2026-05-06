import { Table, Typography } from "antd";
import type { PlayerProfileResponse } from "../../types/players";

const { Title } = Typography;

interface Props {
  markets: PlayerProfileResponse["markets"];
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export default function MarketAnalysis({ markets }: Props) {
  if (markets.length === 0) {
    return <div style={{ color: "var(--muted-text)" }}>No market data available.</div>;
  }

  const columns = [
    { title: "Market", dataIndex: "market" },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      sorter: (a: (typeof markets)[number], b: (typeof markets)[number]) =>
        a.win_rate - b.win_rate,
      render: (v: number) => pct(v),
    },
    { title: "Graded", dataIndex: "total_graded" },
    { title: "Wins", dataIndex: "wins" },
    {
      title: "Avg Line",
      dataIndex: "avg_line",
      render: (v: number | null) => v != null ? v.toFixed(1) : "—",
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        Market Analysis
      </Title>
      <div className="dashboard-table">
        <Table
          columns={columns}
          dataSource={markets}
          rowKey="market"
          size="small"
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
