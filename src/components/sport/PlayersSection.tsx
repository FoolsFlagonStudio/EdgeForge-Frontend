import { useState } from "react";
import { Input, Table, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { PlayerListItem } from "../../types/players";

interface Props {
  sport: string;
}

export default function PlayersSection({ sport }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<{ players: PlayerListItem[]; total: number }>({
    queryKey: ["players", sport],
    queryFn: () =>
      apiFetch(`${API_ROUTES.players()}?sport=${sport}&page=1&limit=50&min_samples=5`),
  });

  const players = data?.players ?? [];

  const filtered = search
    ? players.filter((p) => p.player_name.toLowerCase().includes(search.toLowerCase()))
    : players;

  const columns = [
    {
      title: "Player",
      dataIndex: "player_name",
      render: (name: string, row: PlayerListItem) => (
        <span className="player-link" onClick={() => navigate(`/players/${row.id}`)}>
          {name}
        </span>
      ),
    },
    { title: "Team", dataIndex: "team_name" },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      sorter: (a: PlayerListItem, b: PlayerListItem) => (a.win_rate ?? 0) - (b.win_rate ?? 0),
      render: (v: number | null) => v != null ? `${(v * 100).toFixed(1)}%` : "—",
    },
    {
      title: "Graded",
      dataIndex: "total_graded",
      sorter: (a: PlayerListItem, b: PlayerListItem) => a.total_graded - b.total_graded,
    },
  ];

  if (isLoading) return <Spin />;

  return (
    <div>
      <Input
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 300, marginBottom: 16 }}
        allowClear
      />
      <div className="dashboard-table">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          size="small"
          pagination={{ defaultPageSize: 25, pageSizeOptions: ["25", "50", "100"] }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
