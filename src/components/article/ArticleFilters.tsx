import { useQuery } from "@tanstack/react-query";
import { Input, Select } from "antd";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { Game } from "../../types/games";

const { Option } = Select;

interface Props {
  sport: string;
  onSportChange: (v: string) => void;
  author: string;
  onAuthorChange: (v: string) => void;
  gameId: string;
  onGameChange: (v: string) => void;
}

function formatGameDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00").toLocaleDateString();
}

export default function ArticleFilters({ sport, onSportChange, author, onAuthorChange, gameId, onGameChange }: Props) {
  const { data: upcomingGames = [] } = useQuery<Game[]>({
    queryKey: ["upcoming-games"],
    queryFn: () => apiFetch(API_ROUTES.upcomingGames),
  });

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      <Select
        value={sport}
        onChange={onSportChange}
        style={{ width: 140 }}
        placeholder="Sport"
      >
        <Option value="">All Sports</Option>
        <Option value="nba">NBA</Option>
        <Option value="nhl">NHL</Option>
        <Option value="mlb">MLB</Option>
      </Select>
      <Input
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        placeholder="Search by author..."
        style={{ width: 220 }}
        allowClear
      />
      <Select
        value={gameId || undefined}
        onChange={(v) => onGameChange(v ?? "")}
        style={{ width: 220 }}
        placeholder="Filter by game"
        allowClear
        onClear={() => onGameChange("")}
        showSearch
        optionFilterProp="children"
      >
        {upcomingGames.map((g) => (
          <Option key={g.id} value={String(g.id)}>
            {g.away_team.abbreviation} @ {g.home_team.abbreviation} — {formatGameDate(g.date)}
          </Option>
        ))}
      </Select>
    </div>
  );
}
