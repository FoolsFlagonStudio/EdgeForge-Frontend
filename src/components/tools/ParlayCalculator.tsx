import { useState } from "react";
import { Button, InputNumber, Typography } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { parlayDecimalOdds, decimalToAmerican, fmtOdds, fmtUsd, americanToImplied } from "../../lib/oddsMath";

const { Title, Text } = Typography;

export default function ParlayCalculator() {
  const [legs, setLegs] = useState<(number | null)[]>([-110, -110]);
  const [stake, setStake] = useState<number | null>(100);

  const validLegs = legs.filter((l): l is number => l != null && l !== 0);
  const combinedDecimal = validLegs.length ? parlayDecimalOdds(validLegs) : 1;
  const combinedAmerican = validLegs.length ? decimalToAmerican(combinedDecimal) : 0;
  const impliedProb = validLegs.length
    ? validLegs.reduce((acc, o) => acc * americanToImplied(o), 1)
    : 0;
  const payout = stake != null ? stake * combinedDecimal : 0;
  const profit = payout - (stake ?? 0);

  return (
    <div className="stat-card">
      <Title level={4} style={{ marginTop: 0 }}>Parlay Calculator</Title>
      <Text style={{ color: "var(--text-secondary)" }}>
        Enter each leg's American odds.
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {legs.map((leg, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Text style={{ width: 56, color: "var(--text-secondary)" }}>Leg {i + 1}</Text>
            <InputNumber
              style={{ flex: 1 }}
              value={leg}
              onChange={(v) => setLegs((ls) => ls.map((x, idx) => (idx === i ? v : x)))}
              placeholder="-110"
            />
            {legs.length > 2 && (
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                onClick={() => setLegs((ls) => ls.filter((_, idx) => idx !== i))}
              />
            )}
          </div>
        ))}
        <Button
          icon={<Plus size={16} />}
          onClick={() => setLegs((ls) => [...ls, -110])}
          style={{ alignSelf: "flex-start" }}
        >
          Add Leg
        </Button>
      </div>

      <div style={{ marginTop: 20 }}>
        <Text strong>Total Stake ($)</Text>
        <InputNumber style={{ width: "100%", marginTop: 6 }} value={stake} onChange={setStake} min={0} />
      </div>

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <StatBox label="Combined Odds" value={validLegs.length ? fmtOdds(combinedAmerican) : "—"} />
        <StatBox label="Implied Probability" value={validLegs.length ? `${(impliedProb * 100).toFixed(1)}%` : "—"} />
        <StatBox label="Payout" value={validLegs.length ? fmtUsd(payout) : "—"} />
        <StatBox label="Profit" value={validLegs.length ? fmtUsd(profit) : "—"} accent />
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: accent ? "var(--brand-primary)" : "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}
