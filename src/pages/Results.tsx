import { useQuery } from "@tanstack/react-query";
import { Spin, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import ResultsCalendar from "../components/results/ResultsCalendar";
import SuggestedCombos from "../components/results/SuggestedCombos";

const { Title } = Typography;

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
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function sumDays(days: DayResult[]) {
  return days.reduce(
    (acc, d) => ({
      wins: acc.wins + d.wins,
      losses: acc.losses + d.losses,
      voids: acc.voids + d.voids,
      net_units: acc.net_units + d.net_units,
    }),
    { wins: 0, losses: 0, voids: 0, net_units: 0 },
  );
}

function winPct(wins: number, losses: number): string {
  const total = wins + losses;
  return total ? `${((wins / total) * 100).toFixed(1)}%` : "—";
}

export default function Results() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);

  const { data, isLoading } = useQuery<ResultsByDayResponse>({
    queryKey: ["results-recap", toDateStr(start), toDateStr(today)],
    queryFn: () => apiFetch(API_ROUTES.resultsByDay(toDateStr(start), toDateStr(today))),
  });

  const days = data?.days ?? [];
  const yesterdayStr = toDateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));
  const yesterday = days.find((d) => d.date === yesterdayStr);
  const week = sumDays(days.filter((d) => d.date !== toDateStr(today)));

  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 32 }}>Results</Title>

      {isLoading ? (
        <div className="flex-center" style={{ padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <>
          <Title level={3} style={{ marginBottom: 16 }}>Yesterday</Title>
          <div className="stats-grid" style={{ marginBottom: 40 }}>
            <div className="stat-card">
              <div className="stat-card-label">Record</div>
              <div className="stat-card-value">{yesterday ? yesterday.record_str : "No picks"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Win Rate</div>
              <div className="stat-card-value">{yesterday ? winPct(yesterday.wins, yesterday.losses) : "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Net Units</div>
              <div
                className="stat-card-value"
                style={{ color: yesterday && yesterday.net_units < 0 ? "var(--danger)" : "var(--success)" }}
              >
                {yesterday ? `${yesterday.net_units >= 0 ? "+" : ""}${yesterday.net_units.toFixed(2)}u` : "—"}
              </div>
            </div>
          </div>

          <Title level={3} style={{ marginBottom: 16 }}>Last 7 Days</Title>
          <div className="stats-grid" style={{ marginBottom: 40 }}>
            <div className="stat-card">
              <div className="stat-card-label">Record</div>
              <div className="stat-card-value">{week.wins}-{week.losses}{week.voids ? `-${week.voids}` : ""}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Win Rate</div>
              <div className="stat-card-value">{winPct(week.wins, week.losses)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Net Units</div>
              <div
                className="stat-card-value"
                style={{ color: week.net_units < 0 ? "var(--danger)" : "var(--success)" }}
              >
                {week.net_units >= 0 ? "+" : ""}{week.net_units.toFixed(2)}u
              </div>
            </div>
          </div>
        </>
      )}

      <Title level={3} style={{ marginBottom: 16 }}>Calendar</Title>
      <ResultsCalendar />

      <Title level={3} style={{ margin: "40px 0 16px" }}>Suggested Combos</Title>
      <SuggestedCombos />
    </div>
  );
}
