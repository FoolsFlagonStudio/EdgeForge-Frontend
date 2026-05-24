import { Spin, Typography } from "antd";
import SportGameCard from "./SportGameCard";
import type { Game } from "../../types/games";

const { Title } = Typography;

interface Props {
  games: Game[];
  loading: boolean;
}

export default function TodaysGames({ games, loading }: Props) {
  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        Today's Games
      </Title>
      {loading ? (
        <div className="flex-center">
          <Spin />
        </div>
      ) : games.length === 0 ? (
        <div style={{ color: "var(--muted-text)" }}>No games scheduled today.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {games.map((g) => (
            <SportGameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
