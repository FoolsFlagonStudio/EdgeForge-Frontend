import type { SnapshotResponse } from "../../types/users";

interface Props {
  snapshot: SnapshotResponse;
}

export default function TodaysPicksCard({ snapshot }: Props) {
  const { today } = snapshot;
  const sportEntries = Object.entries(today?.props_by_sport ?? {}).filter(([, count]) => count > 0);

  return (
    <div className="card">
      <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
        Today's Available Picks
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--muted-text)" }}>Props</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>
            {today?.props ?? 0}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--muted-text)" }}>Moneylines</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>
            {today?.moneylines ?? 0}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--muted-text)", marginBottom: 8 }}>
            Props by Sport
          </div>
          {sportEntries.length > 0 ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {sportEntries.map(([sport, count]) => (
                <div
                  key={sport}
                  style={{
                    background: "var(--bg-elevated)",
                    borderRadius: 6,
                    padding: "2px 10px",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  {sport.toUpperCase()}: {count}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--muted-text)" }}>None today</div>
          )}
        </div>
      </div>
    </div>
  );
}
