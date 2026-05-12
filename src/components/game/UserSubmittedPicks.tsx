import { Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import type { GamePick } from "../../types/games";
import { formatMarketName } from "../../lib/markets";

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

  function formatPickDetail(row: GamePick): string {
    const d = row.pick_detail ?? {};
    if (row.pick_type === "moneyline") {
      return d.pick_team ? `${d.pick_team} ML` : "Moneyline";
    }
    if (d.player_name) {
      const market = d.market ? formatMarketName(d.market) : "";
      const comp = d.comparator === "over" ? "Over" : d.comparator === "under" ? "Under" : d.comparator ?? "";
      return `${d.player_name} — ${comp} ${d.line ?? ""} ${market}`.trim();
    }
    return "—";
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
    {
      title: "Pick",
      key: "pick",
      render: (_: unknown, row: GamePick) => formatPickDetail(row),
    },
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
