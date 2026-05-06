import { Table, Tag } from "antd";

import type { MoneylineBySportRow } from "../../types/moneylines";

export default function MoneylineBySportTable({
  data,
}: {
  data: MoneylineBySportRow[];
}) {
  return (
    <Table
      className="dashboard-table"
      rowKey="sport"
      dataSource={data}
      pagination={false}
      columns={[
        {
          title: "Sport",
          dataIndex: "sport",
          render: (s) => <strong>{s}</strong>,
        },
        {
          title: "Win Rate",
          dataIndex: "win_rate",
          sorter: (a, b) => a.win_rate - b.win_rate,
          render: (r) => (
            <Tag color={r >= 0.55 ? "green" : r >= 0.5 ? "gold" : "red"}>
              {(r * 100).toFixed(1)}%
            </Tag>
          ),
        },
        {
          title: "Wins",
          dataIndex: "wins",
        },
        {
          title: "Total",
          dataIndex: "total",
        },
      ]}
    />
  );
}
