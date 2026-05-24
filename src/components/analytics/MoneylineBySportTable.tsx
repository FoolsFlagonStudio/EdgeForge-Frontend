import { Table } from "antd";
import type { MoneylineBySportRow } from "../../types/moneylines";
import { winRateTag } from "../../lib/pickTags";

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
      scroll={{ x: "max-content" }}
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
          render: (r: number) => winRateTag(r),
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
