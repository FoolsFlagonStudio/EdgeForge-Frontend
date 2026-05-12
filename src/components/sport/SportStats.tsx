import { Spin, Typography } from "antd";
import type { SportAnalytics } from "../../types/games";
import { formatMarketName } from "../../lib/markets";

const { Title } = Typography;

interface Props {
  analytics: SportAnalytics | undefined;
  loading: boolean;
}

function pct(n: number | null | undefined) {
  return n != null ? `${(n * 100).toFixed(1)}%` : "—";
}

function fmt(n: number | null | undefined) {
  return n != null ? n.toLocaleString() : "—";
}

export default function SportStats({ analytics, loading }: Props) {
  if (loading) {
    return (
      <div className="flex-center mt-32">
        <Spin />
      </div>
    );
  }
  if (!analytics) return null;

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        Stats
      </Title>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div className="stat-card">
          <div className="stat-card-label">Total Graded</div>
          <div className="stat-card-value">{fmt(analytics.total_graded)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Overall Win Rate</div>
          <div className="stat-card-value">{pct(analytics.win_rate)}</div>
        </div>
      </div>

      {(analytics.by_market ?? []).length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 12, color: "var(--text-secondary)" }}>
            By Market
          </Title>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {analytics.by_market.map((m) => (
              <div
                key={m.market}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: 12, color: "var(--muted-text)", marginBottom: 4 }}>
                  {formatMarketName(m.market)}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
                  {pct(m.win_rate)}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted-text)" }}>{m.total} graded</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
