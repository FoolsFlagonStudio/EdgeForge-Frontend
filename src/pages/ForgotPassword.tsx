import { useState } from "react";
import { Button, Input, Typography, message } from "antd";
import { supabase } from "../lib/supabase";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      void message.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth-card-wrapper">
      <Title level={2} style={{ marginBottom: 16 }}>
        Forgot Password
      </Title>
      {sent ? (
        <Text type="secondary">
          Check your email for a password reset link.
        </Text>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
            type="email"
            onPressEnter={handleReset}
          />
          <Button type="primary" size="large" block onClick={handleReset} loading={loading}>
            Send Reset Link
          </Button>
        </div>
      )}
    </div>
  );
}
