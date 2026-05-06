import type { SnapshotResponse } from "../../types/users";

interface Props {
  snapshot: SnapshotResponse;
}

function fmt(n: number | null | undefined) {
  return n != null ? n.toLocaleString() : "—";
}

function pct(n: number | null | undefined) {
  return n != null ? `${(n * 100).toFixed(1)}%` : "—";
}

export default function StatsSnapshot({ snapshot }: Props) {
  const { headline, top_tier } = snapshot;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      <div className="stat-card">
        <div className="stat-card-label">Total Graded</div>
        <div className="stat-card-value">{fmt(headline.total_graded)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">All-Time Win Rate</div>
        <div className="stat-card-value">{pct(headline.overall_win_rate)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Core (Conf 5) Win Rate</div>
        <div className="stat-card-value">{pct(top_tier?.win_rate)}</div>
        {top_tier?.total != null && (
          <div className="stat-card-sub">{fmt(top_tier.total)} picks graded</div>
        )}
      </div>
    </div>
  );
}
