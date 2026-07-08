import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Radio, Select, Spin, Tabs, Tag, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import { supabase } from "../lib/supabase";
import { ALL_MARKETS, formatMarketName } from "../lib/markets";
import type { GameDetail as GameDetailType } from "../types/games";
import type { MeResponse } from "../types/users";
import MoneylineProjection from "../components/game/MoneylineProjection";
import RunlineProjection from "../components/game/RunlineProjection";
import TotalProjection from "../components/game/TotalProjection";
import FreePicks from "../components/game/FreePicks";
import UserSubmittedPicks from "../components/game/UserSubmittedPicks";
import ProPicksSection from "../components/game/ProPicksSection";
import ParlayList from "../components/game/ParlayList";
import ParlaySlip from "../components/game/ParlaySlip";

const { Title } = Typography;

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [playerOptions, setPlayerOptions] = useState<{ value: number; label: string }[]>([]);
  const playerSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      setLoggedIn(true);
      try {
        const me = await apiFetch<MeResponse>(API_ROUTES.me);
        const sub = me.subscription?.status;
        setIsSubscriber(
          me.role === "admin" || sub === "active" || sub === "trialing",
        );
      } catch {
        // not subscribed
      }
    });
  }, []);

  const { data: game, isLoading, refetch: refetchGame } = useQuery<GameDetailType>({
    queryKey: ["game", id],
    queryFn: () => apiFetch(API_ROUTES.gameDetail(id!)),
    enabled: !!id,
  });

  const freeStraights = (game?.straights ?? []).filter((s) => s.is_free);
  const proStraights = (game?.straights ?? []).filter((s) => !s.is_free);

  const handleSubmitPick = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const body: Record<string, any> = {
        game_id: Number(id),
        pickable_type: values.pickable_type,
        reasoning: values.reasoning || null,
      };

      if (values.pickable_type === "Moneyline") {
        body.pickable_id = String(game?.moneyline?.id ?? "");
        body.pick_team = values.pick_team ?? null;
      } else if (values.pickable_type === "Straight") {
        body.pickable_id = values.pickable_id;
      } else if (values.pickable_type === "Custom") {
        const opt = playerOptions.find((o) => o.value === values.custom_player);
        body.custom_detail = {
          player_id: values.custom_player,
          player_name: opt?.label ?? "",
          market: values.custom_market,
          line: values.custom_line,
          direction: values.custom_direction ?? "over",
        };
      }

      await apiFetch(API_ROUTES.submitPick, {
        method: "POST",
        body: JSON.stringify(body),
      });
      form.resetFields();
      setSubmitOpen(false);
      refetchGame();
    } catch {
      // error handled by apiFetch
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="page-container" style={{ color: "var(--muted-text)" }}>
        Game not found.
      </div>
    );
  }

  const gameDate = new Date(game.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusColor: Record<string, string> = {
    scheduled: "blue",
    in_progress: "orange",
    final: "default",
  };

  const handlePlayerSearch = (q: string) => {
    if (playerSearchTimer.current) clearTimeout(playerSearchTimer.current);
    if (q.length < 2) { setPlayerOptions([]); return; }
    playerSearchTimer.current = setTimeout(async () => {
      try {
        const rows = await apiFetch<{ player_id: number; player_name: string }[]>(
          `${API_ROUTES.playersSearch}?q=${encodeURIComponent(q)}`
        );
        setPlayerOptions(rows.map((r) => ({ value: r.player_id, label: r.player_name })));
      } catch {
        setPlayerOptions([]);
      }
    }, 300);
  };

  const straightOptions = (game.straights ?? []).map((s) => ({
    label: `${s.player_name ?? "?"} — ${formatMarketName(s.market)} ${s.comparator} ${s.line}`,
    value: s.id,
  }));

  const teamOptions = [
    { label: game.away_team.team_name, value: game.away_team.team_name },
    { label: game.home_team.team_name, value: game.home_team.team_name },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 8 }}>
        <Tag color={statusColor[game.status] ?? "default"} style={{ textTransform: "capitalize" }}>
          {game.status.replace("_", " ")}
        </Tag>
      </div>
      <Title level={1} style={{ marginBottom: 4 }}>
        {game.away_team.team_name} @ {game.home_team.team_name}
      </Title>
      <div style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        {game.sport.name.toUpperCase()} · {gameDate}
      </div>

      {game.moneyline && <MoneylineProjection moneyline={game.moneyline} />}
      {game.runline && <RunlineProjection runline={game.runline} />}
      {game.total && <TotalProjection total={game.total} />}

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>
            Picks
          </Title>
          {loggedIn && (
            <Button onClick={() => setSubmitOpen(true)}>
              Submit Pick
            </Button>
          )}
        </div>
        <Tabs
          defaultActiveKey="free"
          items={[
            {
              key: "free",
              label: `Free Picks (${freeStraights.length})`,
              children: <FreePicks picks={freeStraights} gameId={Number(id)} loggedIn={loggedIn} />,
            },
            {
              key: "user",
              label: `User Submitted (${game.user_pick_count ?? game.picks.length})`,
              children: <UserSubmittedPicks picks={game.picks} />,
            },
            {
              key: "parlays",
              label: `Parlays (${game.parlay_count ?? 0})`,
              children: <ParlayList gameId={id!} />,
            },
          ]}
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Pro Picks
        </Title>
        <ProPicksSection straights={proStraights} isSubscriber={isSubscriber} gameId={Number(id)} loggedIn={loggedIn} />
      </div>

      {game.articles && game.articles.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ marginBottom: 16 }}>Related Articles</Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {game.articles.map((a) => (
              <a
                key={a.article_id}
                href={`/articles/${a.article_id}`}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--card-bg)", borderRadius: 8, border: "1px solid var(--border)", color: "var(--text-primary)", textDecoration: "none" }}
              >
                <span style={{ fontWeight: 500 }}>{a.title}</span>
                {a.published_at && (
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {new Date(a.published_at).toLocaleDateString()}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <ParlaySlip />

      <Modal
        title="Submit Your Pick"
        open={submitOpen}
        onCancel={() => { setSubmitOpen(false); form.resetFields(); setPlayerOptions([]); }}
        onOk={() => form.submit()}
        okText="Submit"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitPick} style={{ marginTop: 16 }}>
          <Form.Item name="pickable_type" label="Pick Type" rules={[{ required: true }]}>
            <Select
              placeholder="Select type"
              options={[
                ...(game.moneyline ? [{ label: "Moneyline", value: "Moneyline" }] : []),
                { label: "Player Prop", value: "Straight" },
                { label: "Custom Prop", value: "Custom" },
              ]}
              onChange={() => {
                form.resetFields(["pickable_id", "pick_team", "custom_player", "custom_market", "custom_line", "custom_direction"]);
                setPlayerOptions([]);
              }}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.pickable_type !== cur.pickable_type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue("pickable_type");
              if (type === "Straight") {
                return (
                  <Form.Item name="pickable_id" label="Prop" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select prop"
                      options={straightOptions}
                      showSearch
                      filterOption={(input, opt) =>
                        (opt?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                );
              }
              if (type === "Moneyline") {
                return (
                  <Form.Item name="pick_team" label="Pick Team" rules={[{ required: true, message: "Select a team" }]}>
                    <Radio.Group>
                      {teamOptions.map((t) => (
                        <Radio key={t.value} value={t.value}>{t.label}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                );
              }
              if (type === "Custom") {
                return (
                  <>
                    <Form.Item name="custom_player" label="Player" rules={[{ required: true, message: "Select a player" }]}>
                      <Select
                        showSearch
                        filterOption={false}
                        onSearch={handlePlayerSearch}
                        options={playerOptions}
                        placeholder="Search by name..."
                        notFoundContent={null}
                      />
                    </Form.Item>
                    <Form.Item name="custom_market" label="Market" rules={[{ required: true }]}>
                      <Select
                        showSearch
                        placeholder="Select a market"
                        options={ALL_MARKETS.map((m) => ({
                          label: `[${m.sport}] ${m.label}`,
                          value: m.value,
                        }))}
                        filterOption={(input, opt) =>
                          (opt?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                    <Form.Item name="custom_direction" label="Direction" initialValue="over">
                      <Radio.Group>
                        <Radio value="over">Over</Radio>
                        <Radio value="under">Under</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item name="custom_line" label="Line" rules={[{ required: true }]}>
                      <InputNumber min={0} step={0.5} style={{ width: "100%" }} placeholder="e.g. 24.5" />
                    </Form.Item>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 12 }}>
                      Custom picks are graded automatically and count toward your record.
                    </div>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item name="reasoning" label="Reasoning (optional)">
            <Input.TextArea rows={3} placeholder="Why are you making this pick?" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
