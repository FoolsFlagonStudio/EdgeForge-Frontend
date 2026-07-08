import { Card, Tag } from "antd";
import type { Total } from "../../types/games";

interface Props {
  total: Total;
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

export default function TotalProjection({ total }: Props) {
  const isOver = total.pick_direction === "over";
  const directionColor = isOver ? "var(--success)" : "var(--danger)";

  return (
    <Card
      title={
        <span>
          Total (O/U)
          {total.edge_bucket && (
            <Tag color={BUCKET_COLOR[total.edge_bucket] ?? "default"} style={{ marginLeft: 10, textTransform: "capitalize" }}>
              {total.edge_bucket.replace("_", " ")}
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
          <div className="stat-card-value" style={{ fontSize: 22, color: directionColor, textTransform: "capitalize" }}>
            {total.pick_direction} {total.total_line}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Model Total</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {total.model_total.toFixed(1)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Market Line</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {total.total_line}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Edge (runs)</div>
          <div className="stat-card-value" style={{ fontSize: 22, color: directionColor }}>
            {total.edge > 0 ? "+" : ""}{total.edge.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Odds</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {fmtOdds(total.pick_odds)}
          </div>
        </div>
      </div>
    </Card>
  );
}
