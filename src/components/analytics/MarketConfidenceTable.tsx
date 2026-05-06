import { Table, Tag, Typography } from "antd";
import { formatMarketName } from "../../lib/markets";

const { Text } = Typography;

export type MarketConfidenceRow = {
  market: string;
  confidence: number;
  wins: number;
  total: number;
  win_rate: string;
  low_sample: boolean;
};

/**
 * Groups rows by market for nested table display
 */
function groupByMarket(rows: MarketConfidenceRow[]) {
  const grouped: Record<string, MarketConfidenceRow[]> = {};

  rows.forEach((row) => {
    if (!grouped[row.market]) {
      grouped[row.market] = [];
    }
    grouped[row.market].push(row);
  });

  return Object.entries(grouped).map(([market, rows]) => ({
    key: market,
    market: formatMarketName(market),
    children: rows
      .sort((a, b) => b.confidence - a.confidence)
      .map((r) => ({
        ...r,
        key: `${r.market}-${r.confidence}`,
      })),
  }));
}

export default function MarketConfidenceTable({
  data,
}: {
  data: MarketConfidenceRow[];
}) {
  if (!data || data.length === 0) return null;

  const columns = [
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
      width: 200,
      render: (value: string, record: any) =>
        record.children ? <strong>{value}</strong> : null,
    },
    {
      title: "Confidence",
      dataIndex: "confidence",
      key: "confidence",
      width: 110,
    },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      key: "win_rate",
      width: 130,
      render: (value: string) =>
        value ? `${(Number(value) * 100).toFixed(1)}%` : "—",
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
      width: 90,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 100,
    },
    {
      title: "Sample",
      dataIndex: "low_sample",
      key: "sample",
      width: 110,
      render: (low: boolean) =>
        low ? <Tag color="orange">Low</Tag> : <Tag color="green">Stable</Tag>,
    },
  ];

  return (
    <>
      <Table
            className="dashboard-table"
        columns={columns}
        dataSource={groupByMarket(data)}
        pagination={false}
        sticky
        scroll={{
          y: 420,
          x: "max-content",
        }}
      />

      <Text type="secondary" style={{ fontSize: 12 }}>
        Market performance reflects historical straight player prop bets only.
        Parlays and moneylines are excluded.
      </Text>
    </>
  );
}
