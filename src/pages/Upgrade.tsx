import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function Upgrade() {
  return (
    <div className="container-narrow" style={{ textAlign: "center" }}>
      <Title level={1}>Reactivate Your Subscription</Title>
      <Paragraph style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 32 }}>
        Your subscription has ended. Reactivate to access picks, analytics, and more.
      </Paragraph>
      <Link to="/subscribe">
        <Button type="primary" size="large">
          Reactivate
        </Button>
      </Link>
    </div>
  );
}
