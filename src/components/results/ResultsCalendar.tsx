import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

interface DayResult {
  date: string;
  wins: number;
  losses: number;
  voids: number;
  net_units: number;
  record_str: string;
}

interface ResultsByDayResponse {
  days: DayResult[];
  range: { start: string; end: string };
}

const SPORTS = [
  { id: undefined, label: "All" },
  { id: "nba", label: "NBA" },
  { id: "wnba", label: "WNBA" },
  { id: "mlb", label: "MLB" },
  { id: "nfl", label: "NFL" },
  { id: "nhl", label: "NHL" },
] as const;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Color intensity scales mildly with |net units|, capped so one huge day doesn't wash out the rest. */
function cellStyle(day: DayResult | undefined): React.CSSProperties {
  if (!day || (day.wins === 0 && day.losses === 0)) {
    return { background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" };
  }
  const magnitude = Math.min(Math.abs(day.net_units) / 5, 1); // full saturation by +/-5u
  if (day.net_units > 0) {
    return { background: `rgba(34, 197, 94, ${0.15 + magnitude * 0.55})`, border: "1px solid var(--success)" };
  }
  if (day.net_units < 0) {
    return { background: `rgba(239, 68, 68, ${0.15 + magnitude * 0.55})`, border: "1px solid var(--danger)" };
  }
  return { background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" };
}

export default function ResultsCalendar() {
  const [monthStart, setMonthStart] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [sport, setSport] = useState<string | undefined>(undefined);

  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

  const { data, isLoading } = useQuery<ResultsByDayResponse>({
    queryKey: ["results-by-day", toDateStr(monthStart), toDateStr(monthEnd), sport],
    queryFn: () => apiFetch(API_ROUTES.resultsByDay(toDateStr(monthStart), toDateStr(monthEnd), sport)),
  });

  const byDate = useMemo(() => {
    const map = new Map<string, DayResult>();
    (data?.days ?? []).forEach((d) => map.set(d.date, d));
    return map;
  }, [data]);

  const cells = useMemo(() => {
    const firstWeekday = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
    return out;
  }, [monthStart, monthEnd]);

  const monthLabel = monthStart.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="stat-card">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1))}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{monthLabel}</div>
        <button
          onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1))}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {WEEKDAYS.map((w, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, color: "var(--text-secondary)" }}>{w}</div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const day = byDate.get(toDateStr(date));
          const style = cellStyle(day);
          const tooltip = day && (day.wins || day.losses)
            ? `${day.record_str}  ·  ${day.net_units >= 0 ? "+" : ""}${day.net_units.toFixed(2)}u`
            : "No picks";
          return (
            <Tooltip key={i} title={`${date.getDate()} — ${tooltip}`}>
              <div
                style={{
                  ...style,
                  borderRadius: 6,
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  cursor: "default",
                }}
              >
                {date.getDate()}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
