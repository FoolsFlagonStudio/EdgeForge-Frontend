import { useNavigate } from "react-router-dom";
import type { Game } from "../../types/games";

interface Props {
  game: Game;
}

export default function FeaturedGameCard({ game }: Props) {
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
      <div className="game-card-meta" style={{ marginBottom: 12 }}>
        {game.sport.name.toUpperCase()} · {gameDate}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--muted-text)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>{game.straight_count} Straights</span>
        <span>·</span>
        <span>{game.parlay_count} Parlays</span>
        <span>·</span>
        <span>{game.user_pick_count} User Picks</span>
      </div>
    </div>
  );
}
