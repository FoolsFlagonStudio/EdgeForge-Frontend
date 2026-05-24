import { useState } from "react";
import { Button, Select, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function Subscribe() {
  const [cycle, setCycle] = useState<"monthly" | "3month" | "6month" | "annual">("monthly");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { url } = await apiFetch<{ url: string }>(API_ROUTES.billingCheckout, {
        method: "POST",
        body: JSON.stringify({ billing_cycle: cycle }),
      });
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow" style={{ textAlign: "center" }}>
      <Title level={1}>Subscribe to EdgeForge</Title>
      <Paragraph style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 32 }}>
        Get access to confidence-graded picks, full analytics, and article writing.
      </Paragraph>

      <div style={{ marginBottom: 24 }}>
        <Select value={cycle} onChange={setCycle} size="large" style={{ width: 200 }}>
          <Option value="monthly">Monthly</Option>
          <Option value="3month">3 Months</Option>
          <Option value="6month">6 Months</Option>
          <Option value="annual">Annual</Option>
        </Select>
      </div>

      <Button type="primary" size="large" onClick={handleCheckout} loading={loading}>
        Subscribe
      </Button>
    </div>
  );
}
