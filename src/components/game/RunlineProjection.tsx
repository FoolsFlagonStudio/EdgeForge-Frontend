import { Card, Tag } from "antd";
import type { RunLine } from "../../types/games";

interface Props {
  runline: RunLine;
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtOdds(n: number | null) {
  if (n == null) return "—";
  return n > 0 ? `+${n}` : `${n}`;
}

const BUCKET_COLOR: Record<string, string> = {
  ultra: "gold",
  elite: "green",
  strong: "blue",
  solid: "cyan",
  thin: "default",
  coin_flip: "default",
};

export default function RunlineProjection({ runline }: Props) {
  const edgeColor = runline.edge > 0 ? "var(--success)" : "var(--danger)";

  return (
    <Card
      title={
        <span>
          Run Line
          {runline.edge_bucket && (
            <Tag color={BUCKET_COLOR[runline.edge_bucket] ?? "default"} style={{ marginLeft: 10, textTransform: "capitalize" }}>
              {runline.edge_bucket.replace("_", " ")}
            </Tag>
          )}
        </span>
      }
      style={{ marginBottom: 24 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16,
        }}
      >
        <div className="stat-card">
          <div className="stat-card-label">Pick</div>
          <div className="stat-card-value" style={{ fontSize: 18 }}>
            {runline.pick_team}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            {runline.pick_side}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Model Probability</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {pct(runline.model_prob)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Implied Probability</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {pct(runline.implied_prob)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Edge</div>
          <div className="stat-card-value" style={{ fontSize: 22, color: edgeColor }}>
            {pct(runline.edge)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Odds</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {fmtOdds(runline.pick_odds)}
          </div>
        </div>
      </div>
    </Card>
  );
}
