import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, message } from "antd";
import { supabase } from "../lib/supabase";

const { Title, Text } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      void message.error(error.message);
    } else {
      void message.success("Check your email to confirm your account.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="auth-card-wrapper">
      <Title level={2} style={{ marginBottom: 24 }}>
        Create Account
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
          onPressEnter={handleRegister}
        />
        <Button type="primary" size="large" block onClick={handleRegister} loading={loading}>
          Create Account
        </Button>
        <Text type="secondary" style={{ textAlign: "center", marginTop: 8 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--brand-primary)" }}>
            Log In
          </Link>
        </Text>
      </div>
    </div>
  );
}
