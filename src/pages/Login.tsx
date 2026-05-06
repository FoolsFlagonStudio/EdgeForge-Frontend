import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, message } from "antd";
import { supabase } from "../lib/supabase";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      void message.error(error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="auth-card-wrapper">
      <Title level={2} style={{ marginBottom: 24 }}>
        Log In
      </Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="large"
          type="email"
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="large"
          onPressEnter={handleLogin}
        />
        <Button type="primary" size="large" block onClick={handleLogin} loading={loading}>
          Log In
        </Button>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <Text type="secondary">
            <Link to="/forgot-password" style={{ color: "var(--text-secondary)" }}>
              Forgot password?
            </Link>
          </Text>
          <Text type="secondary">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--brand-primary)" }}>
              Register
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
