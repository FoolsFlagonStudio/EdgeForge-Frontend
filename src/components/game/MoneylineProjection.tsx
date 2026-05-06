import { Card } from "antd";
import type { Moneyline } from "../../types/games";

interface Props {
  moneyline: Moneyline;
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtOdds(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

export default function MoneylineProjection({ moneyline }: Props) {
  const edgeColor = moneyline.edge > 0 ? "var(--success)" : "var(--danger)";

  return (
    <Card title="Moneyline Projection" style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16,
        }}
      >
        <div className="stat-card">
          <div className="stat-card-label">Pick</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {moneyline.pick}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Model Probability</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {pct(moneyline.model_prob)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Implied Probability</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {pct(moneyline.implied_prob)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Edge</div>
          <div className="stat-card-value" style={{ fontSize: 22, color: edgeColor }}>
            {pct(moneyline.edge)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Odds</div>
          <div className="stat-card-value" style={{ fontSize: 22 }}>
            {fmtOdds(moneyline.pick_odds)}
          </div>
        </div>
      </div>
    </Card>
  );
}
