import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

interface Props {
  loggedIn: boolean;
}

export default function CTABanner({ loggedIn }: Props) {
  return (
    <div className="cta-banner">
      <Title level={1} className="cta-banner-title" style={{ margin: 0 }}>
        {loggedIn ? "Your Edge Starts Here" : "Bet Smarter with Data-Driven Picks"}
      </Title>
      <Paragraph className="cta-banner-subtitle">
        {loggedIn
          ? "View today's picks, track performance, and stay ahead of the market."
          : "Access confidence-graded props, moneylines, and community picks across NBA, NHL, and MLB."}
      </Paragraph>
      {!loggedIn && (
        <Link to="/register">
          <Button type="primary" size="large">
            Get Started Free
          </Button>
        </Link>
      )}
      {loggedIn && (
        <Link to="/dashboard">
          <Button type="primary" size="large">
            View Today's Picks
          </Button>
        </Link>
      )}
    </div>
  );
}
