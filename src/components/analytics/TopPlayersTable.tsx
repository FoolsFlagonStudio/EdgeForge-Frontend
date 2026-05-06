import { Table, Space, Segmented, Select, Spin, Alert, Tag } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import PlayerProfileModal from "./PlayerProfileModal";

type TopPlayerRow = {
  player_id: number;
  player_name: string;
  sport: string;
  recent_total: number;
  recent_wins: number;
  recent_win_rate: number | null;
  alltime_total: number;
  alltime_win_rate: number;
  trend: number | null;
};

type TopPlayersResponse = {
  days: number;
  cutoff: string;
  min_samples: number;
  sport_filter?: string;
  players: TopPlayerRow[];
};

const DAY_OPTIONS = [7, 14, 30, 60, 90];
const SPORT_OPTIONS = [
  { label: "All Sports", value: "" },
  { label: "NBA", value: "NBA" },
  { label: "MLB", value: "MLB" },
  { label: "NHL", value: "NHL" },
];

export default function TopPlayersTable() {
  const [days, setDays] = useState(30);
  const [sport, setSport] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<TopPlayersResponse>({
    queryKey: ["top-players", days, sport],
    queryFn: () => apiFetch(API_ROUTES.topPlayers(days, 5, sport || undefined)),
  });

  const columns = [
    {
      title: "Player",
      dataIndex: "player_name",
      key: "player_name",
      render: (name: string, r: TopPlayerRow) => (
        <span
          className="player-link"
          onClick={() => setSelectedPlayerId(r.player_id)}
        >
          {name}
        </span>
      ),
    },
    {
      title: "Sport",
      dataIndex: "sport",
      key: "sport",
      render: (s: string) => <Tag>{s}</Tag>,
    },
    {
      title: `Recent (${days}d)`,
      key: "recent",
      render: (_: any, r: TopPlayerRow) =>
        r.recent_win_rate != null
          ? `${r.recent_wins}/${r.recent_total} (${(r.recent_win_rate * 100).toFixed(0)}%)`
          : `${r.recent_wins}/${r.recent_total}`,
    },
    {
      title: "All-Time Win Rate",
      key: "alltime",
      render: (_: any, r: TopPlayerRow) => (
        <Tag color={r.alltime_win_rate >= 0.6 ? "green" : r.alltime_win_rate >= 0.5 ? "blue" : "orange"}>
          {(r.alltime_win_rate * 100).toFixed(1)}%
        </Tag>
      ),
      sorter: (a: TopPlayerRow, b: TopPlayerRow) =>
        a.alltime_win_rate - b.alltime_win_rate,
    },
    {
      title: "Trend",
      key: "trend",
      render: (_: any, r: TopPlayerRow) => {
        if (r.trend == null) return "—";
        const pct = (r.trend * 100).toFixed(1);
        return (
          <Tag color={r.trend > 0 ? "green" : r.trend < 0 ? "red" : "default"}>
            {r.trend > 0 ? "+" : ""}
            {pct}%
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space wrap>
          <Segmented
            value={days}
            onChange={(v) => setDays(Number(v))}
            options={DAY_OPTIONS.map((d) => ({ label: `${d}d`, value: d }))}
          />
          <Select
            value={sport}
            onChange={setSport}
            options={SPORT_OPTIONS}
            style={{ width: 140 }}
          />
        </Space>

        {isLoading && <Spin />}
        {error && <Alert type="error" message="Failed to load top players" />}

        {data && (
          <Table
            className="dashboard-table"
            dataSource={data.players}
            columns={columns}
            rowKey="player_id"
            pagination={{ pageSize: 20 }}
            size="small"
            scroll={{ x: "max-content" }}
          />
        )}
      </Space>

      <PlayerProfileModal
        playerId={selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
      />
    </>
  );
}
