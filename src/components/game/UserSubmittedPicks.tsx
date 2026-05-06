import { Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import type { GamePick } from "../../types/games";

interface Props {
  picks: GamePick[];
}

function resultTag(result: string | null) {
  if (!result) return <Tag>Pending</Tag>;
  if (result === "win") return <Tag color="green">Win</Tag>;
  if (result === "loss") return <Tag color="red">Loss</Tag>;
  return <Tag>Push</Tag>;
}

export default function UserSubmittedPicks({ picks }: Props) {
  const navigate = useNavigate();

  if (picks.length === 0) {
    return (
      <div style={{ color: "var(--muted-text)", padding: "24px 0" }}>
        No user picks submitted yet.
      </div>
    );
  }

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_: unknown, row: GamePick) => (
        <span
          className="player-link"
          onClick={() => navigate(`/users/${row.user.id}`)}
        >
          {row.user.display_name ?? "Anonymous"}
        </span>
      ),
    },
    {
      title: "Trust",
      dataIndex: ["user", "trust_score"],
      render: (v: number) => v.toFixed(2),
      sorter: (a: GamePick, b: GamePick) => a.user.trust_score - b.user.trust_score,
    },
    { title: "Type", dataIndex: "pick_type" },
    {
      title: "Reasoning",
      dataIndex: "reasoning",
      render: (v: string | null) => v ?? "—",
    },
    {
      title: "Result",
      dataIndex: "result",
      render: (v: string | null) => resultTag(v),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <div className="dashboard-table">
      <Table
        columns={columns}
        dataSource={picks}
        rowKey="id"
        size="small"
        pagination={{ defaultPageSize: 25 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
