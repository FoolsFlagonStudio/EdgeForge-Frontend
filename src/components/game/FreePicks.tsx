import { Table, Tag } from "antd";
import type { Straight } from "../../types/games";
import { formatMarketName } from "../../lib/markets";

interface Props {
  picks: Straight[];
}

function resultTag(result: string | null) {
  if (!result) return <Tag>Pending</Tag>;
  if (result === "win") return <Tag color="green">Win</Tag>;
  if (result === "loss") return <Tag color="red">Loss</Tag>;
  return <Tag>Push</Tag>;
}

function confidenceTag(confidence: number | null) {
  if (confidence === null || confidence === undefined) return <Tag>—</Tag>;
  const config: Record<number, { color: string; label: string }> = {
    5: { color: "green",   label: "5 — Core" },
    4: { color: "cyan",    label: "4 — Strong" },
    3: { color: "gold",    label: "3 — Value" },
    2: { color: "orange",  label: "2 — Weak" },
    1: { color: "red",     label: "1 — Speculative" },
  };
  const c = config[confidence];
  return c ? <Tag color={c.color}>{c.label}</Tag> : <Tag>{confidence}</Tag>;
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
      render: (m: string) => formatMarketName(m),
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
      title: "Confidence",
      dataIndex: "confidence",
      render: (v: number | null) => confidenceTag(v),
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
