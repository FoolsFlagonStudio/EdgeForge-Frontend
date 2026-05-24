import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Spin, Table, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import { supabase } from "../lib/supabase";
import type { UserProfile as UserProfileType, UserPickSummary, ArticleSummary } from "../types/users";

const { Title, Text } = Typography;

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setCurrentUserId(data.session?.user.id ?? null);
    });
  }, []);

  const { data: profile, isLoading } = useQuery<UserProfileType>({
    queryKey: ["user-profile", id],
    queryFn: () => apiFetch(API_ROUTES.userProfile(id!)),
    enabled: !!id,
  });

  useEffect(() => {
    if (profile) setFollowing(profile.is_following);
  }, [profile]);

  const handleFollow = async () => {
    const method = following ? "DELETE" : "POST";
    await apiFetch(API_ROUTES.followUser(id!), { method });
    setFollowing(!following);
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container" style={{ color: "var(--muted-text)" }}>
        User not found.
      </div>
    );
  }

  const winRate = profile.wins + profile.losses > 0
    ? ((profile.wins / (profile.wins + profile.losses)) * 100).toFixed(1)
    : "—";

  const pickColumns = [
    {
      title: "Game",
      dataIndex: "game_label",
      render: (v: string, row: UserPickSummary) => (
        <span className="player-link" onClick={() => navigate(`/games/${row.game_id}`)}>
          {v}
        </span>
      ),
    },
    { title: "Type", dataIndex: "pick_type" },
    {
      title: "Result",
      dataIndex: "result",
      render: (v: string | null) => {
        if (!v) return <Tag>Pending</Tag>;
        if (v === "win") return <Tag color="green">Win</Tag>;
        if (v === "loss") return <Tag color="red">Loss</Tag>;
        return <Tag>Push</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "game_date",
      render: (v: string) => v ? new Date(v).toLocaleDateString() : "—",
    },
  ];

  return (
    <div className="page-container">
      <div className="profile-header">
        <Avatar
          size={72}
          src={profile.avatar_url}
          icon={<UserOutlined />}
          style={{ background: "var(--bg-card)", border: "2px solid var(--border-subtle)", flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
            <Title level={2} style={{ margin: 0 }}>
              {profile.display_name ?? "Anonymous"}
            </Title>
            {loggedIn && currentUserId !== profile.id && (
              <Button size="small" onClick={handleFollow}>
                {following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
          {profile.bio && <Text type="secondary">{profile.bio}</Text>}
        </div>
      </div>

      <div className="profile-stats-row">
        <div className="profile-stat">
          <div className="profile-stat-value">{winRate}%</div>
          <div className="profile-stat-label">Win Rate</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{profile.trust_score != null ? profile.trust_score.toFixed(2) : "—"}</div>
          <div className="profile-stat-label">Trust Score</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{profile.wins}</div>
          <div className="profile-stat-label">Wins</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{profile.losses}</div>
          <div className="profile-stat-label">Losses</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{profile.followers_count}</div>
          <div className="profile-stat-label">Followers</div>
        </div>
        {(profile.specialties ?? []).length > 0 && (
          <div className="profile-stat" style={{ textAlign: "left" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(profile.specialties ?? []).map((s) => (
                <Tag key={s} style={{ textTransform: "uppercase" }}>{s}</Tag>
              ))}
            </div>
            <div className="profile-stat-label" style={{ marginTop: 4 }}>Specialties</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 40 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Pick History
        </Title>
        <div className="dashboard-table">
          <Table
            columns={pickColumns}
            dataSource={profile.recent_picks ?? []}
            rowKey="id"
            size="small"
            pagination={{ defaultPageSize: 25 }}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      {(profile.articles ?? []).length > 0 && (
        <div>
          <Title level={3} style={{ marginBottom: 16 }}>
            Articles
          </Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(profile.articles ?? []).map((a: ArticleSummary) => (
              <div
                key={a.id}
                className="article-card"
                onClick={() => navigate(`/articles/${a.id}`)}
              >
                <div className="article-card-title">{a.title}</div>
                {a.subtitle && <div className="article-card-subtitle">{a.subtitle}</div>}
                <div className="article-card-meta">
                  {a.published_at && (
                    <span>{new Date(a.published_at).toLocaleDateString()}</span>
                  )}
                  {a.sport && <span>{a.sport?.toUpperCase()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
