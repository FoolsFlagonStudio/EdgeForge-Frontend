import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Spin, Tooltip, Typography } from "antd";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { MeResponse } from "../types/users";
import type { ArticleListItem } from "../types/articles";
import ArticleCard from "../components/article/ArticleCard";
import ArticleFilters from "../components/article/ArticleFilters";

const { Title } = Typography;

interface ArticlesResponse {
  articles: ArticleListItem[];
  total: number;
  page: number;
  per_page: number;
}

export default function ArticleList() {
  const [sport, setSport] = useState("");
  const [author, setAuthor] = useState("");
  const [gameId, setGameId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [canWrite, setCanWrite] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      try {
        const me = await apiFetch<MeResponse>(API_ROUTES.me);
        const sub = me.subscription?.status;
        setCanWrite(me.role === "admin" || sub === "active" || sub === "trialing");
      } catch { /* not subscribed */ }
    });
  }, []);

  const params = new URLSearchParams({ page: String(page), per_page: "20" });
  if (sport) params.set("sport", sport);
  if (author) params.set("author_id", author);
  if (gameId) params.set("game_id", gameId);

  const { data, isLoading } = useQuery<ArticlesResponse>({
    queryKey: ["articles", sport, author, gameId, page],
    queryFn: () => apiFetch(`${API_ROUTES.articles}?${params.toString()}`),
  });

  const articles = data?.articles ?? [];

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={1} style={{ margin: 0 }}>
          Articles
        </Title>
        <Tooltip title={canWrite ? undefined : "Subscribe to EdgeForge to write articles"}>
          <Link to={canWrite ? "/articles/new" : "/pricing"}>
            <Button type={canWrite ? "primary" : "default"}>
              {canWrite ? "Write Article" : "Write Article (Pro)"}
            </Button>
          </Link>
        </Tooltip>
      </div>

      <ArticleFilters
        sport={sport}
        onSportChange={(v) => { setSport(v); setPage(1); }}
        author={author}
        onAuthorChange={(v) => { setAuthor(v); setPage(1); }}
        gameId={gameId}
        onGameChange={(v) => { setGameId(v); setPage(1); }}
      />

      {isLoading ? (
        <div className="flex-center mt-32">
          <Spin />
        </div>
      ) : articles.length === 0 ? (
        <div style={{ color: "var(--muted-text)", padding: "48px 0" }}>No articles found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {data && data.total > data.per_page && (
        <div className="flex-center mt-32">
          <Pagination
            current={page}
            pageSize={data.per_page}
            total={data.total}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
