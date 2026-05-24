import { Table } from "antd";
import { winRateTag } from "../../lib/pickTags";

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
      scroll={{ x: "max-content" }}
      columns={[
        {
          title: "Confidence",
          dataIndex: "confidence",
          sorter: (a, b) => b.confidence - a.confidence,
        },
        {
          title: "Win Rate",
          dataIndex: "win_rate",
          render: (v: string) => winRateTag(Number(v)),
        },
        { title: "Wins", dataIndex: "wins" },
        { title: "Losses", dataIndex: "losses" },
        { title: "Voids", dataIndex: "voids" },
        { title: "Total", dataIndex: "total" },
      ]}
    />
  );
}
