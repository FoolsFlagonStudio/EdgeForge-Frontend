import { Table, Tag } from "antd";

type Row = {
  confidence: number;
  wins: number;
  losses: number;
  voids: number;
  total: number;
  win_rate: string;
};

export default function ConfidencePerformanceTable({ data }: { data: Row[] }) {
  return (
    <Table
      className="dashboard-table"
      rowKey="confidence"
      dataSource={data}
      pagination={false}
      columns={[
        {
          title: "Confidence",
          dataIndex: "confidence",
          sorter: (a, b) => b.confidence - a.confidence,
        },
        {
          title: "Win Rate",
          dataIndex: "win_rate",
          render: (v: string) => (
            <Tag color={Number(v) >= 0.6 ? "green" : "orange"}>
              {(Number(v) * 100).toFixed(1)}%
            </Tag>
          ),
        },
        { title: "Wins", dataIndex: "wins" },
        { title: "Losses", dataIndex: "losses" },
        { title: "Voids", dataIndex: "voids" },
        { title: "Total", dataIndex: "total" },
      ]}
    />
  );
}
