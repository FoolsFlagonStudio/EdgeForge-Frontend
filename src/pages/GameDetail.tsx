import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Spin, Tabs, Tag, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import { supabase } from "../lib/supabase";
import type { GameDetail as GameDetailType } from "../types/games";
import type { MeResponse } from "../types/users";
import MoneylineProjection from "../components/game/MoneylineProjection";
import FreePicks from "../components/game/FreePicks";
import UserSubmittedPicks from "../components/game/UserSubmittedPicks";
import ProPicksSection from "../components/game/ProPicksSection";

const { Title } = Typography;

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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

  const handleSubmitPick = async (values: {
    pickable_type: string;
    pickable_id: string;
    reasoning?: string;
  }) => {
    setSubmitting(true);
    try {
      await apiFetch(API_ROUTES.submitPick, {
        method: "POST",
        body: JSON.stringify({
          game_id: Number(id),
          pickable_type: values.pickable_type,
          pickable_id: values.pickable_id,
          reasoning: values.reasoning || null,
        }),
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

  const straightOptions = (game.straights ?? []).map((s) => ({
    label: `${s.player_name ?? "?"} — ${s.market} ${s.comparator} ${s.line}`,
    value: s.id,
  }));

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
              children: <FreePicks picks={freeStraights} />,
            },
            {
              key: "user",
              label: `User Submitted (${game.picks.length})`,
              children: <UserSubmittedPicks picks={game.picks} />,
            },
          ]}
        />
      </div>

      <div>
        <Title level={3} style={{ marginBottom: 16 }}>
          Pro Picks
        </Title>
        <ProPicksSection straights={proStraights} isSubscriber={isSubscriber} />
      </div>

      <Modal
        title="Submit Your Pick"
        open={submitOpen}
        onCancel={() => { setSubmitOpen(false); form.resetFields(); }}
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
              ]}
              onChange={(val) => {
                if (val === "Moneyline" && game.moneyline) {
                  form.setFieldValue("pickable_id", String(game.moneyline.id));
                } else if (val !== "Moneyline") {
                  form.setFieldValue("pickable_id", undefined);
                }
              }}
            />
          </Form.Item>
          <Form.Item name="pickable_id" hidden><Input /></Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.pickable_type !== cur.pickable_type}
          >
            {({ getFieldValue }) =>
              getFieldValue("pickable_type") === "Straight" ? (
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
              ) : getFieldValue("pickable_type") === "Moneyline" ? (
                <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
                  Picking with the system moneyline: <strong>{game.moneyline?.pick ?? "—"}</strong>
                </div>
              ) : null
            }
          </Form.Item>
          <Form.Item name="reasoning" label="Reasoning (optional)">
            <Input.TextArea rows={3} placeholder="Why are you making this pick?" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
