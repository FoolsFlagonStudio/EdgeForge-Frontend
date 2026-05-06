import { Table, Progress, Typography } from "antd";
import LineBreakdownTable from "./LineBreakdownTable";
import { formatMarketName } from "../../lib/markets";

const { Text } = Typography;

type Props = {
  markets: Record<string, any>;
};

export default function MarketSummaryTable({ markets }: Props) {
  const data = Object.entries(markets)
    .map(([market, stats]) => ({
      key: market,
      market,
      ...stats,
    }))
    .sort((a, b) => Number(b.win_rate) - Number(a.win_rate));

  if (data.length === 0) {
    return (
      <Text type="secondary">No graded bets yet for this player.</Text>
    );
  }

  return (
    <Table
      className="dashboard-table"
      dataSource={data}
      pagination={false}
      tableLayout="fixed"
      style={{ width: "100%" }}
      expandable={{
        expandedRowRender: (row) => <LineBreakdownTable lines={row.lines} />,
      }}
      columns={[
        {
          title: "Market",
          dataIndex: "market",
          render: (m: string, row: any) => row.label ?? formatMarketName(m),
        },
        {
          title: "Record",
          width: 100,
          render: (_, r) => `${r.wins} / ${r.total}`,
        },
        {
          title: "Win Rate",
          width: 160,
          render: (_, r) => (
            <Progress
              className="progress-bar"
              percent={Number((r.win_rate * 100).toFixed(1))}
              size="small"
            />
          ),
        },
      ]}
    />
  );
}
