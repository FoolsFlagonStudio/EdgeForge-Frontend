import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin, Typography } from "antd";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

const { Text } = Typography;

interface ComboLeg {
  pickable_type: string;
  label: string | null;
}

interface Combo {
  id: string;
  date: string;
  sport_id: string;
  result: "win" | "loss" | "void" | null;
  odds: number | null;
  stake_units: number;
  net_units: number | null;
  legs: ComboLeg[];
}

interface SuggestedCombosResponse {
  summary: {
    total: number;
    wins: number;
    losses: number;
    pending: number;
    win_pct: number | null;
    net_units: number;
  };
  combos: Combo[];
}

const SPORTS = [
  { id: undefined, label: "All" },
  { id: "nba", label: "NBA" },
  { id: "wnba", label: "WNBA" },
  { id: "mlb", label: "MLB" },
  { id: "nfl", label: "NFL" },
  { id: "nhl", label: "NHL" },
] as const;

function fmtOdds(o: number | null): string {
  if (o == null) return "—";
  return o >= 0 ? `+${o}` : `${o}`;
}

const RESULT_LABEL: Record<string, string> = { win: "WIN", loss: "LOSS", void: "VOID" };
const RESULT_COLOR: Record<string, string> = {
  win: "var(--success)",
  loss: "var(--danger)",
  void: "var(--text-secondary)",
};

export default function SuggestedCombos() {
  const [sport, setSport] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery<SuggestedCombosResponse>({
    queryKey: ["suggested-combos", sport],
    queryFn: () => apiFetch(API_ROUTES.suggestedCombos(undefined, undefined, sport)),
  });

  const summary = data?.summary;

  return (
    <div className="stat-card">
      <div style={{ marginBottom: 4, fontSize: 13, color: "var(--text-secondary)" }}>
        Auto-suggested combo posted alongside each sport's daily card — tracked separately from
        the single-pick record. Tracking starts 2026-09-18.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0" }}>
        {SPORTS.map((s) => (
          <button
            key={s.label}
            onClick={() => setSport(s.id)}
            style={{
              padding: "4px 12px",
              borderRadius: 16,
              border: `1px solid ${sport === s.id ? "var(--brand-primary)" : "var(--border-subtle)"}`,
              background: sport === s.id ? "var(--brand-primary-soft)" : "transparent",
              color: sport === s.id ? "var(--brand-primary)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex-center" style={{ padding: 24 }}>
          <Spin />
        </div>
      ) : !summary || summary.total === 0 ? (
        <Text style={{ color: "var(--text-secondary)" }}>No suggested combos yet for this filter.</Text>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 20 }}>
            <SummaryBox label="Record" value={`${summary.wins}-${summary.losses}`} />
            <SummaryBox label="Win Rate" value={summary.win_pct != null ? `${summary.win_pct}%` : "—"} />
            <SummaryBox
              label="Net Units"
              value={`${summary.net_units >= 0 ? "+" : ""}${summary.net_units.toFixed(2)}u`}
              color={summary.net_units < 0 ? "var(--danger)" : "var(--success)"}
            />
            {summary.pending > 0 && <SummaryBox label="Pending" value={String(summary.pending)} />}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data!.combos.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "12px 14px",
                  background: "var(--bg-elevated)",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {c.sport_id.toUpperCase()} · {c.date}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtOdds(c.odds)}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: c.result ? RESULT_COLOR[c.result] : "var(--text-secondary)",
                      }}
                    >
                      {c.result ? RESULT_LABEL[c.result] : "PENDING"}
                      {c.net_units != null && ` (${c.net_units >= 0 ? "+" : ""}${c.net_units.toFixed(2)}u)`}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {c.legs.map((leg, i) => (
                    <div key={i} style={{ fontSize: 13, color: "var(--text-primary)" }}>
                      {leg.label ?? `${leg.pickable_type} (unresolved)`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: color ?? "var(--text-primary)" }}>{value}</div>
    </div>
  );
}
