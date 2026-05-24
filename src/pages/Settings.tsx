import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Input, Spin, Typography, message } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { MeResponse } from "../types/users";

const { Title, Text } = Typography;

function BillingSection({ me }: { me: MeResponse }) {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    try {
      const { url } = await apiFetch<{ url: string }>(API_ROUTES.billingPortal, {
        method: "POST",
      });
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  };

  const sub = me.subscription;
  const statusLabels: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    canceled: "Canceled",
    past_due: "Past Due",
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 12 }}>
        Subscription
      </Title>
      <div className="card" style={{ marginBottom: 16, maxWidth: 480 }}>
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">Status</Text>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color:
                sub?.status === "active" || sub?.status === "trialing"
                  ? "var(--success)"
                  : "var(--danger)",
              marginTop: 4,
            }}
          >
            {sub?.status ? statusLabels[sub.status] ?? sub.status : "No Subscription"}
          </div>
        </div>
        {sub?.renews_at && (
          <Text type="secondary">
            Renews: {new Date(sub.renews_at).toLocaleDateString()}
          </Text>
        )}
      </div>
      <Button type="primary" onClick={openPortal} loading={loading}>
        Manage Subscription
      </Button>
    </div>
  );
}

function AccountSection({ me }: { me: MeResponse }) {
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(me.display_name ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(API_ROUTES.me, {
        method: "PATCH",
        body: JSON.stringify({ display_name: displayName.trim() || null }),
      });
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void message.success("Display name updated.");
    } catch {
      void message.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Text type="secondary">Email</Text>
        <div style={{ fontWeight: 500, color: "var(--text-primary)", marginTop: 4 }}>{me.email}</div>
      </div>
      <div>
        <Text type="secondary" style={{ display: "block", marginBottom: 6 }}>Display Name</Text>
        <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            onPressEnter={handleSave}
          />
          <Button type="primary" onClick={handleSave} loading={saving}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { data: me, isLoading } = useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: () => apiFetch(API_ROUTES.me),
  });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!me) return null;

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <Title level={2} style={{ marginBottom: 32 }}>
        Settings
      </Title>

      <section style={{ marginBottom: 40 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Account
        </Title>
        <Divider style={{ margin: "8px 0 20px" }} />
        <AccountSection me={me} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Billing
        </Title>
        <Divider style={{ margin: "8px 0 20px" }} />
        <BillingSection me={me} />
      </section>

      <section>
        <Title level={3} style={{ marginBottom: 4 }}>
          Security
        </Title>
        <Divider style={{ margin: "8px 0 20px" }} />
        <Text type="secondary">
          To change your password, use the{" "}
          <a href="/forgot-password" style={{ color: "var(--accent)" }}>
            forgot password
          </a>{" "}
          flow.
        </Text>
      </section>
    </div>
  );
}
