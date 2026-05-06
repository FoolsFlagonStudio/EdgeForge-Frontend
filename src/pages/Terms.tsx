import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Terms() {
  return (
    <div className="container-narrow" style={{ textAlign: "left" }}>
      <Title level={1}>Terms of Service</Title>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        By using EdgeForge, you agree to these terms. This platform provides sports analytics and
        picks for informational and entertainment purposes only. EdgeForge does not guarantee outcomes
        or profits. Use of this service is at your own risk.
      </Paragraph>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        You must be 18 years of age or older to use this service. You agree not to misuse the
        platform or attempt to circumvent subscription access controls.
      </Paragraph>
    </div>
  );
}
