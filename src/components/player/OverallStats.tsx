import type { PlayerProfileResponse } from "../../types/players";

interface Props {
  profile: PlayerProfileResponse;
}

function pct(n: number | null | undefined) {
  return n != null ? `${(n * 100).toFixed(1)}%` : "—";
}

export default function OverallStats({ profile }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 16,
      }}
    >
      <div className="stat-card">
        <div className="stat-card-label">Trust Score</div>
        <div className="stat-card-value">
          {profile.trust_score != null ? profile.trust_score.toFixed(2) : "—"}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Win Rate</div>
        <div className="stat-card-value">{pct(profile.overall.win_rate)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Total Graded</div>
        <div className="stat-card-value">{profile.overall.total_graded}</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Wins</div>
        <div className="stat-card-value" style={{ color: "var(--success)" }}>
          {profile.wins}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Losses</div>
        <div className="stat-card-value" style={{ color: "var(--danger)" }}>
          {profile.losses}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Avg Confidence</div>
        <div className="stat-card-value">
          {profile.overall.avg_confidence != null ? profile.overall.avg_confidence.toFixed(1) : "—"}
        </div>
      </div>
    </div>
  );
}
