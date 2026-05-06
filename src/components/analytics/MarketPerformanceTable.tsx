import { Table, Tag } from "antd";
import { formatMarketName } from "../../lib/markets";

type MarketRow = {
  market: string;
  win_rate: string;
  total: number;
  wins: number;
  losses: number;
  voids: number;
};

export default function MarketPerformanceTable({
  markets,
}: {
  markets: MarketRow[];
}) {
  const columns = [
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
      render: (m: string) => <strong>{formatMarketName(m)}</strong>,
    },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      key: "win_rate",
      render: (wr: string) => (
        <Tag color={Number(wr) >= 0.55 ? "green" : "orange"}>
          {(Number(wr) * 100).toFixed(1)}%
        </Tag>
      ),
      sorter: (a: MarketRow, b: MarketRow) =>
        Number(a.win_rate) - Number(b.win_rate),
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
    },
    {
      title: "Losses",
      dataIndex: "losses",
      key: "losses",
    },
    {
      title: "Total Bets",
      dataIndex: "total",
      key: "total",
      sorter: (a: MarketRow, b: MarketRow) => a.total - b.total,
    },
  ];

  return (
    <Table
      className="dashboard-table"
      rowKey="market"
      columns={columns}
      dataSource={markets}
      pagination={false}
      size="middle"
    />
  );
}
