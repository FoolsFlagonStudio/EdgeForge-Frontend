import { useQuery } from "@tanstack/react-query";
import { Button, Spin, Tag, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";

const { Title, Text } = Typography;

interface Promo {
  id: number;
  platform_name: string;
  description: string | null;
  referral_link: string | null;
  promo_code: string | null;
  logo_url: string | null;
}

export default function Promos() {
  const { data: promos = [], isLoading } = useQuery<Promo[]>({
    queryKey: ["promos"],
    queryFn: () => apiFetch(API_ROUTES.promos),
  });

  return (
    <div className="page-container">
      <Title level={1} style={{ marginBottom: 8 }}>
        Promos & Offers
      </Title>
      <Text style={{ color: "var(--text-secondary)", display: "block", marginBottom: 32 }}>
        Exclusive offers from our partners. Use these links to get the best deals.
      </Text>

      {isLoading ? (
        <div className="flex-center" style={{ padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : promos.length === 0 ? (
        <div style={{ color: "var(--muted-text)", padding: "48px 0" }}>
          No active promos at this time. Check back soon.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {promos.map((promo) => (
            <div
              key={promo.id}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {promo.logo_url && (
                <img
                  src={promo.logo_url}
                  alt={promo.platform_name}
                  style={{ height: 48, objectFit: "contain", alignSelf: "flex-start" }}
                />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>
                  {promo.platform_name}
                </div>
                {promo.description && (
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
                    {promo.description}
                  </div>
                )}
              </div>
              {promo.promo_code && (
                <div>
                  <Text style={{ fontSize: 12, color: "var(--text-secondary)" }}>Promo code</Text>
                  <Tag
                    style={{
                      display: "block",
                      fontFamily: "monospace",
                      fontSize: 14,
                      fontWeight: 600,
                      marginTop: 4,
                      letterSpacing: 1,
                    }}
                  >
                    {promo.promo_code}
                  </Tag>
                </div>
              )}
              {promo.referral_link && (
                <a href={promo.referral_link} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto" }}>
                  <Button type="primary" block>
                    Claim Offer
                  </Button>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
