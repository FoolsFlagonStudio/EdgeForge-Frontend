import { useQuery } from "@tanstack/react-query";
import { Spin, Typography } from "antd";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { SnapshotResponse } from "../types/users";
import type { Game } from "../types/games";
import CTABanner from "../components/home/CTABanner";
import StatsSnapshot from "../components/home/StatsSnapshot";
import FeaturedGameCard from "../components/home/FeaturedGameCard";
import TodaysPicksCard from "../components/home/TodaysPicksCard";

const { Title, Paragraph } = Typography;

const HOW_IT_WORKS = [
  {
    title: "Condition mining, not gut feel",
    body: "Every market is backtested across multiple seasons of real historical odds. A pick only ships if it matches a segment that's been profitable across every season tested, not just on average.",
  },
  {
    title: "Tiered by track record",
    body: "Ultra, Elite, Strong, and Solid tiers come from a pick's matched segment's own validated win rate — the same tier means the same thing every time, whether it's tonight's game or last month's.",
  },
  {
    title: "Full transparency",
    body: "Every pick we post is tracked to a result. The Results page shows the real day-by-day record, wins and losses included, not a highlight reel.",
  },
];

export default function Home() {
  const { data: snapshot, isLoading: snapLoading } = useQuery<SnapshotResponse>({
    queryKey: ["snapshot"],
    queryFn: () => apiFetch(API_ROUTES.snapshot),
  });

  const { data: upcomingGames = [], isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["upcoming-games"],
    queryFn: () => apiFetch(API_ROUTES.upcomingGames),
  });

  return (
    <div>
      <CTABanner />

      <div className="section">
        <div className="container">
          <Title level={3} style={{ marginBottom: 24 }}>
            How EdgeForge Works
          </Title>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {HOW_IT_WORKS.map((item) => (
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
      </div>

      <div className="section-elevated">
        <div className="container">
          {snapLoading ? (
            <div className="flex-center mt-32">
              <Spin />
            </div>
          ) : snapshot ? (
            <StatsSnapshot snapshot={snapshot} />
          ) : null}
        </div>
      </div>

      <div className="section">
        <div className="container">
          <Title level={3} style={{ marginBottom: 24 }}>
            Upcoming Games
          </Title>
          {gamesLoading ? (
            <div className="flex-center">
              <Spin />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {upcomingGames.map((game) => (
                <FeaturedGameCard key={game.id} game={game} />
              ))}
              {upcomingGames.length === 0 && (
                <div style={{ color: "var(--muted-text)" }}>No upcoming games scheduled.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {snapshot && (
        <div className="section-elevated">
          <div className="container" style={{ maxWidth: 860 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              Today's Picks
            </Title>
            <TodaysPicksCard snapshot={snapshot} />
          </div>
        </div>
      )}
    </div>
  );
}
