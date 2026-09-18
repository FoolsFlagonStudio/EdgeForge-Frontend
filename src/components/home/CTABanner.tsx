import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

// TODO: real Discord invite link — placeholder until one exists.
const DISCORD_INVITE_URL = "#";

export default function CTABanner() {
  return (
    <div className="cta-banner">
      <Title level={1} className="cta-banner-title" style={{ margin: 0 }}>
        Bet Smarter with Data-Driven Picks
      </Title>
      <Paragraph className="cta-banner-subtitle">
        Condition-mined, backtest-validated picks across NBA, WNBA, MLB, NFL, and NHL —
        every pick's tier reflects its own historical track record, not a guess.
      </Paragraph>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/results">
          <Button type="primary" size="large">
            See Today's Record
          </Button>
        </Link>
        <a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer">
          <Button size="large">Join the Discord</Button>
        </a>
      </div>
    </div>
  );
}
