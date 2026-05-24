import { Table } from "antd";
import type { Straight } from "../../types/games";
import { formatMarketName } from "../../lib/markets";
import { resultTag, confidenceTag } from "../../lib/pickTags";
import ParlayCartButton from "./ParlayCartButton";

interface Props {
  picks: Straight[];
  gameId?: number;
  loggedIn?: boolean;
}

export default function FreePicks({ picks, gameId, loggedIn }: Props) {
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
    ...(loggedIn && gameId != null
      ? [{
          title: "",
          key: "parlay",
          render: (_: unknown, row: Straight) => (
            <ParlayCartButton straight={row} gameId={gameId} />
          ),
        }]
      : []),
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
