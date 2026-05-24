import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Disclaimer() {
  return (
    <div className="container-narrow" style={{ textAlign: "left" }}>
      <Title level={1}>Disclaimer</Title>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        EdgeForge provides sports analytics and AI-generated picks for informational and
        entertainment purposes only. Nothing on this platform constitutes financial, legal, or
        professional gambling advice.
      </Paragraph>
      <Paragraph style={{ color: "var(--text-secondary)" }}>
        Past performance of the model does not guarantee future results. Always gamble responsibly
        and within your means. EdgeForge is not responsible for any financial losses resulting from
        use of this service.
      </Paragraph>
    </div>
  );
}
