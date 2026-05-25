import { useNavigate } from "react-router-dom";
import type { Game } from "../../types/games";

interface Props {
  game: Game;
}

export default function SportGameCard({ game }: Props) {
  const navigate = useNavigate();
  const gameDate = new Date(game.date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="game-card" onClick={() => navigate(`/games/${game.id}`)}>
      <div className="game-card-teams">
        {game.away_team.abbreviation} @ {game.home_team.abbreviation}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
        {game.away_team.team_name} vs {game.home_team.team_name} · {gameDate}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: 12,
          color: "var(--muted-text)",
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: 10,
          marginTop: 10,
        }}
      >
        <span>{game.straight_count} picks</span>
        <span>{game.parlay_count} parlays</span>
        <span>{game.user_pick_count} user picks</span>
      </div>
    </div>
  );
}
