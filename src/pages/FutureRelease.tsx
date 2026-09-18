import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const ROADMAP = [
  {
    title: "Wider league coverage",
    body: "We're actively evaluating soccer (backed by full historical odds across 25+ leagues) and Japanese/Korean baseball as new sports for the condition-mining pipeline, alongside the NBA/WNBA/MLB/NFL/NHL coverage live today.",
  },
  {
    title: "Deeper player prop markets",
    body: "Player prop condition mining launched this season for WNBA, with the same streak-plus-context approach being extended to more sports as enough historical data accumulates to validate it properly.",
  },
  {
    title: "Custom user experiences",
    body: "Longer-term, we want to let you configure your own risk tolerance and market preferences and get a personalized daily slip, rather than one-size-fits-all picks.",
  },
  {
    title: "Always backtested first",
    body: "Every signal on this platform is validated against multiple seasons of real historical odds before it ever goes live — that discipline doesn't change as we add sports or markets.",
  },
];

export default function FutureRelease() {
  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 4 }}>What's Next</Title>
      <Paragraph style={{ color: "var(--text-secondary)", marginBottom: 32, maxWidth: 640 }}>
        EdgeForge is early. Here's the direction we're building toward.
      </Paragraph>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {ROADMAP.map((item) => (
          <div key={item.title} className="stat-card">
            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              {item.title}
            </div>
            <Paragraph style={{ color: "var(--text-secondary)", margin: 0 }}>
              {item.body}
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  );
}
