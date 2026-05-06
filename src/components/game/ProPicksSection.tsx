import { Button, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import type { Straight } from "../../types/games";

interface Props {
  straights: Straight[];
  isSubscriber: boolean;
}

function resultTag(result: string | null) {
  if (!result) return <Tag>Pending</Tag>;
  if (result === "win") return <Tag color="green">Win</Tag>;
  if (result === "loss") return <Tag color="red">Loss</Tag>;
  return <Tag>Push</Tag>;
}

const columns = [
  { title: "Player", dataIndex: "player_name" },
  { title: "Market", dataIndex: "market" },
  {
    title: "Line",
    key: "line",
    render: (_: unknown, row: Straight) => `${row.comparator} ${row.line}`,
  },
  {
    title: "Odds",
    dataIndex: "odds",
    render: (v: number) => (v > 0 ? `+${v}` : v),
  },
  {
    title: "Confidence",
    dataIndex: "confidence",
    sorter: (a: Straight, b: Straight) => a.confidence - b.confidence,
  },
  {
    title: "Risk",
    dataIndex: "risk_profile",
    render: (v: string) => (
      <span className={`risk-${v}`} style={{ textTransform: "capitalize" }}>
        {v}
      </span>
    ),
  },
  {
    title: "Result",
    dataIndex: "result",
    render: (v: string | null) => resultTag(v),
  },
];

export default function ProPicksSection({ straights, isSubscriber }: Props) {
  if (!isSubscriber) {
    return (
      <div className="pro-picks-lock">
        <div className="pro-picks-lock-icon">🔒</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Pro Picks
        </div>
        <div style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Subscribe to access confidence-graded system picks for this game.
        </div>
        <Link to="/subscribe">
          <Button type="primary" size="large">
            Subscribe to EdgeForge
          </Button>
        </Link>
      </div>
    );
  }

  if (straights.length === 0) {
    return (
      <div style={{ color: "var(--muted-text)", padding: "24px 0" }}>
        No system picks generated for this game.
      </div>
    );
  }

  return (
    <div className="dashboard-table">
      <Table
        columns={columns}
        dataSource={straights}
        rowKey="id"
        size="small"
        pagination={{ defaultPageSize: 25 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
