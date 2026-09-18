import { Table } from "antd";
import type { Straight } from "../../types/games";
import { formatMarketName } from "../../lib/markets";
import { resultTag, confidenceTag } from "../../lib/pickTags";

interface Props {
  picks: Straight[];
}

/**
 * Plain read-only picks table for a game. Replaces the old FreePicks/
 * ProPicksSection split — there's no subscription tier or parlay-cart
 * shipping at launch, so every pick is just shown together.
 */
export default function GamePicks({ picks }: Props) {
  if (picks.length === 0) {
    return (
      <div style={{ color: "var(--muted-text)", padding: "24px 0" }}>
        No picks generated for this game yet.
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
      sorter: (a: Straight, b: Straight) => (a.confidence ?? 0) - (b.confidence ?? 0),
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
        pagination={{ defaultPageSize: 25 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
