import { Typography } from "antd";
import OddsConverter from "../components/tools/OddsConverter";
import ParlayCalculator from "../components/tools/ParlayCalculator";
import HedgeCalculator from "../components/tools/HedgeCalculator";

const { Title, Paragraph } = Typography;

export default function Tools() {
  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 4 }}>Betting Tools</Title>
      <Paragraph style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        Quick calculators for sizing and pricing your own bets. Nothing here talks to a
        sportsbook — it's just math.
      </Paragraph>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <OddsConverter />
        <ParlayCalculator />
        <HedgeCalculator />
      </div>
    </div>
  );
}
