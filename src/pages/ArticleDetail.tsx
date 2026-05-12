import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import { supabase } from "../lib/supabase";
import type { Article } from "../types/articles";

const { Title, Text } = Typography;

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setCurrentUserId(data.session?.user.id ?? null);
    });
  }, []);

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ["article", id],
    queryFn: () => apiFetch(API_ROUTES.articleDetail(id!)),
    enabled: !!id,
  });

  const handleFollow = async () => {
    if (!article) return;
    const method = isFollowing ? "DELETE" : "POST";
    await apiFetch(API_ROUTES.followUser(article.author.id), { method });
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-container" style={{ color: "var(--muted-text)" }}>
        Article not found.
      </div>
    );
  }

  const pubDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Draft";

  return (
    <div className="page-container">
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Main content */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <Title level={1} style={{ marginBottom: 8 }}>
            {article.title}
          </Title>
          {article.subtitle && (
            <Title level={3} style={{ marginTop: 0, marginBottom: 16, fontWeight: 400, color: "var(--text-secondary)" }}>
              {article.subtitle}
            </Title>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
              paddingBottom: 16,
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <span
              className="player-link"
              onClick={() => navigate(`/users/${article.author.id}`)}
            >
              {article.author.display_name ?? "Unknown"}
            </span>
            <Text type="secondary">{pubDate}</Text>
            {loggedIn && currentUserId !== article.author.id && (
              <Button size="small" onClick={handleFollow}>
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {(article.games ?? []).length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Associated Games
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {article.games.map((g) => (
                  <div
                    key={g.game_id}
                    className="game-card"
                    style={{ padding: "12px 16px" }}
                    onClick={() => navigate(`/games/${g.game_id}`)}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                      {g.away_team} @ {g.home_team}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted-text)" }}>
                      {new Date(g.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(article.picks ?? []).length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Associated Picks
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {article.picks.map((p) => (
                  <div
                    key={p.pickable_id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "var(--text-primary)",
                    }}
                  >
                    {p.pickable_type === "straight" && p.player_name
                      ? `${p.player_name} — ${p.market} ${p.comparator} ${p.line}`
                      : "Moneyline Pick"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
