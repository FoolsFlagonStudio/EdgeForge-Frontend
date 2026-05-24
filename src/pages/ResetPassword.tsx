import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Typography, message } from "antd";
import { supabase } from "../lib/supabase";

const { Title } = Typography;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!password) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      void message.error(error.message);
    } else {
      void message.success("Password updated. Please log in.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="auth-card-wrapper">
      <Title level={2} style={{ marginBottom: 24 }}>
        Set New Password
      </Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Input.Password
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="large"
          onPressEnter={handleUpdate}
        />
        <Button type="primary" size="large" block onClick={handleUpdate} loading={loading}>
          Update Password
        </Button>
      </div>
    </div>
  );
}
