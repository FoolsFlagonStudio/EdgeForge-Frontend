import { useState } from "react";
import { InputNumber, Typography } from "antd";
import {
  americanToDecimal,
  decimalToAmerican,
  americanToImplied,
  impliedToAmerican,
  decimalToFractional,
} from "../../lib/oddsMath";

const { Title, Text } = Typography;

export default function OddsConverter() {
  const [american, setAmerican] = useState<number | null>(-110);

  let decimal: number | null = null;
  let impliedPct: number | null = null;

  if (american != null) {
    decimal = americanToDecimal(american);
    impliedPct = americanToImplied(american) * 100;
  }

  const handleDecimal = (v: number | null) => {
    if (v == null || v <= 1) { setAmerican(null); return; }
    setAmerican(decimalToAmerican(v));
  };
  const handleImplied = (v: number | null) => {
    if (v == null || v <= 0 || v >= 100) { setAmerican(null); return; }
    setAmerican(impliedToAmerican(v / 100));
  };

  return (
    <div className="stat-card">
      <Title level={4} style={{ marginTop: 0 }}>Odds Converter</Title>
      <Text style={{ color: "var(--text-secondary)" }}>
        Edit any field — the others update to match.
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginTop: 20 }}>
        <div>
          <Text strong>American</Text>
          <InputNumber
            style={{ width: "100%", marginTop: 6 }}
            value={american}
            onChange={setAmerican}
            placeholder="-110"
          />
        </div>
        <div>
          <Text strong>Decimal</Text>
          <InputNumber
            style={{ width: "100%", marginTop: 6 }}
            value={decimal != null ? Number(decimal.toFixed(3)) : null}
            onChange={handleDecimal}
            step={0.01}
            min={1.01}
            placeholder="1.91"
          />
        </div>
        <div>
          <Text strong>Implied Probability (%)</Text>
          <InputNumber
            style={{ width: "100%", marginTop: 6 }}
            value={impliedPct != null ? Number(impliedPct.toFixed(1)) : null}
            onChange={handleImplied}
            step={0.1}
            min={0.1}
            max={99.9}
            placeholder="52.4"
          />
        </div>
        <div>
          <Text strong>Fractional</Text>
          <div style={{ marginTop: 6, padding: "4px 11px", border: "1px solid var(--border-subtle)", borderRadius: 6, color: "var(--text-primary)" }}>
            {decimal != null ? decimalToFractional(decimal) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
