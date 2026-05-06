import { Table, Tag } from "antd";
import type { Straight } from "../../types/games";

interface Props {
  picks: Straight[];
}

function resultTag(result: string | null) {
  if (!result) return <Tag>Pending</Tag>;
  if (result === "win") return <Tag color="green">Win</Tag>;
  if (result === "loss") return <Tag color="red">Loss</Tag>;
  return <Tag>Push</Tag>;
}

export default function FreePicks({ picks }: Props) {
  if (picks.length === 0) {
    return (
      <div style={{ color: "var(--muted-text)", padding: "24px 0" }}>
        No free picks for this game.
      </div>
    );
  }

  const columns = [
    {
      title: "Player",
      key: "player",
      render: (_: unknown, row: Straight) => row.player_name ?? "—",
    },
    {
      title: "Market",
      dataIndex: "market",
    },
    {
      title: "Pick",
      key: "pick",
      render: (_: unknown, row: Straight) => `${row.comparator} ${row.line}`,
    },
    {
      title: "Odds",
      dataIndex: "odds",
      render: (v: number) => (v != null ? (v > 0 ? `+${v}` : v) : "—"),
    },
    {
      title: "Result",
      dataIndex: "result",
      render: (v: string | null) => resultTag(v),
    },
  ];

  return (
    <div className="dashboard-table">
      <Table
        columns={columns}
        dataSource={picks}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
