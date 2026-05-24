import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const plans = [
  { name: "Monthly",  price: "$7.99/mo",  cycle: "monthly" },
  { name: "3 Months", price: "$19.99",    cycle: "3month"  },
  { name: "6 Months", price: "$34.99",    cycle: "6month"  },
  { name: "Annual",   price: "$50/yr",    cycle: "annual"  },
];

const features = [
  "Confidence-graded props & moneylines",
  "Full analytics dashboard",
  "Access to all system parlays",
  "Article reading & writing",
  "Community picks & leaderboard",
];

export default function Pricing() {
  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <Title level={1} style={{ marginBottom: 8 }}>
        Pricing
      </Title>
      <Paragraph style={{ color: "var(--text-secondary)", marginBottom: 40 }}>
        One subscription, full access.
      </Paragraph>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}
      >
        {plans.map((p) => (
          <div key={p.cycle} className="card" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}
            >
              {p.name}
            </div>
            <div
              style={{ fontSize: 24, fontWeight: 700, color: "var(--brand-primary)", marginBottom: 16 }}
            >
              {p.price}
            </div>
            <Link to="/subscribe">
              <Button type="primary" block>
                Get Started
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div>
        <Title level={3} style={{ marginBottom: 16 }}>
          What's included
        </Title>
        <ul style={{ color: "var(--text-secondary)", lineHeight: 2 }}>
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
