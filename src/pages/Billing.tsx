import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { MeResponse } from "../types/users";

const { Title, Text } = Typography;

export default function Billing() {
  const [loading, setLoading] = useState(false);

  const { data: me, isLoading } = useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: () => apiFetch(API_ROUTES.me),
  });

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

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: 80 }}>
        <Spin />
      </div>
    );
  }

  const sub = me?.subscription;
  const statusLabels: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    canceled: "Canceled",
    past_due: "Past Due",
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <Title level={2}>Billing</Title>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Subscription Status</Text>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: sub?.status === "active" || sub?.status === "trialing"
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

      <Button type="primary" size="large" onClick={openPortal} loading={loading}>
        Manage Subscription
      </Button>
    </div>
  );
}
