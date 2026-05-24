import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Privacy() {
  return (
    <div className="container-narrow" style={{ textAlign: "left" }}>
      <Title level={1}>Privacy Policy</Title>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        EdgeForge collects email addresses and usage data to provide and improve the service. We do
        not sell your personal information to third parties. Payment processing is handled securely
        by Stripe.
      </Paragraph>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        By creating an account, you consent to the collection and use of your data as described
        herein. You may request deletion of your account and data at any time by contacting support.
      </Paragraph>
    </div>
  );
}
