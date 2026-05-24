import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pagination, Spin, Table, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { LeaderboardEntry } from "../types/users";

const { Title } = Typography;

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
  page: number;
  per_page: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard", page],
    queryFn: () => apiFetch(`${API_ROUTES.leaderboard}?page=${page}&per_page=25`),
  });

  const entries = data?.entries ?? [];

  const columns = [
    {
      title: "#",
      dataIndex: "rank",
      width: 60,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: v <= 3 ? "var(--brand-primary)" : "var(--muted-text)" }}>
          {v}
        </span>
      ),
    },
    {
      title: "User",
      dataIndex: "display_name",
      render: (name: string, row: LeaderboardEntry) => (
        <span className="player-link" onClick={() => navigate(`/users/${row.id}`)}>
          {name ?? "Anonymous"}
        </span>
      ),
    },
    {
      title: "Trust Score",
      dataIndex: "trust_score",
      sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.trust_score - b.trust_score,
      render: (v: number) => v.toFixed(2),
    },
    {
      title: "Win Rate",
      dataIndex: "win_rate",
      sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.win_rate - b.win_rate,
      render: (v: number) => `${(v * 100).toFixed(1)}%`,
    },
    {
      title: "Wins",
      dataIndex: "wins",
      sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.wins - b.wins,
    },
    {
      title: "Losses",
      dataIndex: "losses",
      sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.losses - b.losses,
    },
    {
      title: "Total Picks",
      dataIndex: "total_picks",
      sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.total_picks - b.total_picks,
    },
  ];

  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 32 }}>
        Leaderboard
      </Title>

      {isLoading ? (
        <div className="flex-center mt-32">
          <Spin />
        </div>
      ) : (
        <>
          <div className="dashboard-table">
            <Table
              columns={columns}
              dataSource={entries}
              rowKey="id"
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          </div>
          {data && data.total > data.per_page && (
            <div className="flex-center mt-24">
              <Pagination
                current={page}
                pageSize={data.per_page}
                total={data.total}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
