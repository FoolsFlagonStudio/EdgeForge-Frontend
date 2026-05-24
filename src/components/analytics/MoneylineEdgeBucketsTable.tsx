import { Progress, Table, Tag } from "antd";
import type { MoneylineEdgeBucketRow } from "./MoneylinesOverview";

export default function MoneylineEdgeBucketsTable({
  data,
}: {
  data: MoneylineEdgeBucketRow[];
}) {
  const columns = [
    {
      title: "Edge Bucket",
      dataIndex: "edge_bucket",
      key: "edge_bucket",
      width: 140,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    { title: "Total", dataIndex: "total", key: "total", width: 90 },
    { title: "Wins", dataIndex: "wins", key: "wins", width: 90 },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      key: "win_rate",
      render: (v: string) => {
        const pct = Number(v) * 100;
        return (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 180 }}>
              <Progress percent={Number(pct.toFixed(1))} showInfo={false} />
            </div>
            <span>{pct.toFixed(1)}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="dashboard-table"
      rowKey={(r) => r.edge_bucket}
      dataSource={data}
      columns={columns}
      pagination={false}
      size="middle"
    />
  );
}
