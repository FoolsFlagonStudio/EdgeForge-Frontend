import { useState } from "react";
import { Alert, InputNumber, Typography } from "antd";
import { americanToDecimal, fmtUsd } from "../../lib/oddsMath";

const { Title, Text, Paragraph } = Typography;

/**
 * "-1" hedge calculator: split a total wager across a moneyline and an
 * alternate spread (e.g. -1.5) so that if the margin is exactly 1 (ML
 * wins, spread misses), profit still hits a target floor.
 *
 * stake_ml = (floor + total) / decimal_ml
 * stake_spread = total - stake_ml
 *
 * If stake_ml falls outside [0, total], the floor isn't achievable with
 * that wager.
 */
export default function HedgeCalculator() {
  const [mlOdds, setMlOdds] = useState<number | null>(-250);
  const [spreadOdds, setSpreadOdds] = useState<number | null>(145);
  const [total, setTotal] = useState<number | null>(100);
  const [floor, setFloor] = useState<number | null>(0);

  const canCompute = mlOdds != null && spreadOdds != null && total != null && total > 0 && floor != null;

  let stakeMl = 0;
  let stakeSpread = 0;
  let achievable = true;

  if (canCompute) {
    const dMl = americanToDecimal(mlOdds!);
    stakeMl = (floor! + total!) / dMl;
    stakeSpread = total! - stakeMl;
    achievable = stakeMl >= 0 && stakeMl <= total!;
  }

  const dMl = mlOdds != null ? americanToDecimal(mlOdds) : 1;
  const dSp = spreadOdds != null ? americanToDecimal(spreadOdds) : 1;

  const profitLoss = -(total ?? 0);
  const profitMargin1 = stakeMl * (dMl - 1) - stakeSpread;
  const profitMargin2plus = stakeMl * (dMl - 1) + stakeSpread * (dSp - 1);

  return (
    <div className="stat-card">
      <Title level={4} style={{ marginTop: 0 }}>ML + Spread Hedge Calculator</Title>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        Splits a wager across the moneyline and an alternate spread (e.g. -1.5) so that
        if the team wins by exactly the margin the spread needs, and only the moneyline
        hits, you still lock in your target minimum profit.
      </Paragraph>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        <Field label="Moneyline Odds" value={mlOdds} onChange={setMlOdds} placeholder="-250" />
        <Field label="Spread Odds (e.g. -1.5)" value={spreadOdds} onChange={setSpreadOdds} placeholder="+145" />
        <Field label="Total Wager ($)" value={total} onChange={setTotal} placeholder="100" min={0} />
        <Field label="Target Min Profit ($)" value={floor} onChange={setFloor} placeholder="0" />
      </div>

      {canCompute && !achievable && (
        <Alert
          style={{ marginTop: 20 }}
          type="warning"
          showIcon
          message="Target not achievable"
          description="This target profit can't be hit by splitting this total wager — lower the target, increase the wager, or the moneyline odds aren't favorable enough."
        />
      )}

      {canCompute && achievable && (
        <>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <StatBox label="Bet on Moneyline" value={fmtUsd(stakeMl)} accent />
            <StatBox label="Bet on Spread" value={fmtUsd(stakeSpread)} accent />
          </div>

          <div style={{ marginTop: 20 }}>
            <Text strong>Outcome Breakdown</Text>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <OutcomeRow label="Team loses outright" profit={profitLoss} />
              <OutcomeRow label="Wins, spread misses by 1 (ML only hits)" profit={profitMargin1} />
              <OutcomeRow label="Wins, spread also hits" profit={profitMargin2plus} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, min,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  min?: number;
}) {
  return (
    <div>
      <Text strong>{label}</Text>
      <InputNumber style={{ width: "100%", marginTop: 6 }} value={value} onChange={onChange} placeholder={placeholder} min={min} />
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

function OutcomeRow({ label, profit }: { label: string; profit: number }) {
  const rounded = Math.round(profit * 100) / 100;
  const positive = rounded >= 0;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: 6 }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: positive ? "var(--success)" : "var(--danger)" }}>
        {positive ? "+" : ""}{fmtUsd(rounded)}
      </span>
    </div>
  );
}
