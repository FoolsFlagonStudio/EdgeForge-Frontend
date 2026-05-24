import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin, Typography } from "antd";
import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/api";
import { API_ROUTES } from "../lib/routes";
import type { SnapshotResponse } from "../types/users";
import type { Game } from "../types/games";
import CTABanner from "../components/home/CTABanner";
import StatsSnapshot from "../components/home/StatsSnapshot";
import FeaturedGameCard from "../components/home/FeaturedGameCard";
import TodaysPicksCard from "../components/home/TodaysPicksCard";

const { Title } = Typography;

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s));
    return () => listener.subscription.unsubscribe();
  }, []);

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
      <CTABanner loggedIn={loggedIn} />

      <div className="section">
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

      <div className="section-elevated">
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
        <div className="section">
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
