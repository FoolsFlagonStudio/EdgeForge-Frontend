import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Select, Switch, Typography, message } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { Game } from "../types/games";
import type { ArticleCreatePayload } from "../types/articles";
import ArticleWriter from "../components/article/ArticleWriter";

const { Title } = Typography;
const { Option } = Select;

function formatGameDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00").toLocaleDateString();
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export default function ArticleNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [sport, setSport] = useState("");
  const [gameIds, setGameIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [pastMode, setPastMode] = useState(false);
  const [pastDate, setPastDate] = useState(todayIso());

  const queryKey = pastMode
    ? ["games-by-date", pastDate]
    : ["upcoming-games"];

  const queryUrl = pastMode
    ? `${API_ROUTES.upcomingGames}?date=${pastDate}`
    : API_ROUTES.upcomingGames;

  const { data: availableGames = [] } = useQuery<Game[]>({
    queryKey,
    queryFn: () => apiFetch(queryUrl),
  });

  const save = async (publish: boolean) => {
    if (!title.trim()) {
      void message.error("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const payload: ArticleCreatePayload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        body,
        published: publish,
        sport_id: sport || undefined,
        game_ids: gameIds.length > 0 ? gameIds : undefined,
      };
      const created = await apiFetch<{ id: string }>(API_ROUTES.articles, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      void message.success(publish ? "Article published!" : "Draft saved.");
      navigate(`/articles/${created.id}`);
    } catch {
      void message.error("Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <Title level={2} style={{ marginBottom: 32 }}>
        Write Article
      </Title>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Title *</div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          size="large"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Subtitle</div>
        <Input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Optional subtitle"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Sport</div>
        <Select value={sport} onChange={setSport} style={{ width: 160 }} allowClear placeholder="Select sport">
          <Option value="nba">NBA</Option>
          <Option value="nhl">NHL</Option>
          <Option value="mlb">MLB</Option>
        </Select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Body *</div>
        <ArticleWriter content={body} onChange={setBody} />
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Associated Games</div>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Past game?</span>
          <Switch
            size="small"
            checked={pastMode}
            onChange={(v) => { setPastMode(v); setGameIds([]); }}
          />
          {pastMode && (
            <input
              type="date"
              max={todayIso()}
              value={pastDate}
              onChange={(e) => { setPastDate(e.target.value); setGameIds([]); }}
              style={{ padding: "2px 8px", borderRadius: 6, border: "1px solid #444", background: "var(--card-bg)", color: "var(--text-primary)", fontSize: 13 }}
            />
          )}
        </div>
        <Select
          mode="multiple"
          value={gameIds}
          onChange={setGameIds}
          style={{ width: "100%" }}
          placeholder="Link to games (optional)"
          optionFilterProp="children"
        >
          {availableGames.map((g) => (
            <Option key={g.id} value={String(g.id)}>
              {g.away_team.abbreviation} @ {g.home_team.abbreviation} — {formatGameDate(g.date)}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Button onClick={() => save(false)} loading={saving} size="large">
          Save Draft
        </Button>
        <Button type="primary" onClick={() => save(true)} loading={saving} size="large">
          Publish
        </Button>
      </div>
    </div>
  );
}
