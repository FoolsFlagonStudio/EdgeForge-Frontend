import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Spin, Table, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { MeResponse, UserProfile as UserProfileType, UserPickSummary, ArticleSummary } from "../types/users";

const { Title, Text } = Typography;

export default function Profile() {
  const navigate = useNavigate();

  const { data: me, isLoading: meLoading } = useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: () => apiFetch(API_ROUTES.me),
  });

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfileType>({
    queryKey: ["user-profile", me?.id],
    queryFn: () => apiFetch(API_ROUTES.userProfile(me!.id)),
    enabled: !!me?.id,
  });

  if (meLoading || profileLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile || !me) {
    return (
      <div className="page-container" style={{ color: "var(--muted-text)" }}>
        Profile not found.
      </div>
    );
  }

  const winRate =
    profile.wins + profile.losses > 0
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
      dataIndex: "created_at",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <div className="page-container">
      {/* Header: avatar + name/bio + follow button */}
      <div
        className="profile-header"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Avatar
            size={80}
            src={profile.avatar_url}
            icon={<UserOutlined />}
            style={{
              background: "var(--bg-card)",
              border: "2px solid var(--border-subtle)",
              flexShrink: 0,
            }}
          />
          <div>
            <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
              {profile.display_name ?? me.email}
            </Title>
            {profile.bio && <Text type="secondary">{profile.bio}</Text>}
          </div>
        </div>
        <Button type="default" disabled>
          Follow
        </Button>
      </div>

      {/* Stats bar: Win Rate | Trust Score | Specialties */}
      <div className="profile-stats-row">
        <div className="profile-stat">
          <div className="profile-stat-value">{winRate}%</div>
          <div className="profile-stat-label">Win Rate</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">
            {profile.trust_score != null ? profile.trust_score.toFixed(2) : "—"}
          </div>
          <div className="profile-stat-label">Trust Score</div>
        </div>
        {(profile.specialties ?? []).length > 0 && (
          <div className="profile-stat" style={{ textAlign: "left" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(profile.specialties ?? []).map((s) => (
                <Tag key={s} style={{ textTransform: "uppercase" }}>
                  {s}
                </Tag>
              ))}
            </div>
            <div className="profile-stat-label" style={{ marginTop: 4 }}>
              Specialties
            </div>
          </div>
        )}
      </div>

      {/* Two-column: Pick History (left) + Articles (right) */}
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left ~60%: Submitted Pick History */}
        <div style={{ flex: "1 1 55%", minWidth: 300 }}>
          <Title level={3} style={{ marginBottom: 16 }}>
            Submitted Pick History
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

        {/* Right ~40%: Submitted Articles */}
        <div style={{ flex: "1 1 35%", minWidth: 260 }}>
          <Title level={3} style={{ marginBottom: 16 }}>
            Submitted Articles
          </Title>
          {(profile.articles ?? []).length === 0 ? (
            <Text type="secondary">No articles submitted yet.</Text>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(profile.articles ?? []).map((a: ArticleSummary) => (
                <div
                  key={a.id}
                  className="article-card"
                  onClick={() => navigate(`/articles/${a.id}`)}
                >
                  <div className="article-card-title">{a.title}</div>
                  {a.subtitle && (
                    <div className="article-card-subtitle">{a.subtitle}</div>
                  )}
                  <div className="article-card-meta">
                    {a.published_at && (
                      <span>{new Date(a.published_at).toLocaleDateString()}</span>
                    )}
                    {a.sport && <span>{a.sport.toUpperCase()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
