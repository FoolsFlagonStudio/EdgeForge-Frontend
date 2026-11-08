import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// jsdom has no matchMedia; antd's responsive Row/Table need it
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  }),
});

const apiFetch = vi.fn();
vi.mock("../../lib/api", () => ({ apiFetch: (path: string) => apiFetch(path) }));

import TrackRecord from "../../components/analytics/TrackRecord";

const stats = {
  picks: 12, graded: 10, wins: 6, losses: 4, pushes: 0, units: 1.85, roi: 0.185,
  win_rate: 0.6, breakeven_rate: 0.52, fair_clv: 1.45, clv_t: 1.1, clv_n: 9, clv_bar_met: false,
};

function renderIt() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <TrackRecord />
    </QueryClientProvider>,
  );
}

beforeEach(() => apiFetch.mockReset());

describe("TrackRecord", () => {
  it("shows the live price-gap record from the record endpoints", async () => {
    apiFetch.mockImplementation((path?: string) =>
      Promise.resolve(
        String(path).startsWith("/api/public/record/summary")
          ? { since: "2026-10-18", overall: stats, note: "Live picks only.",
              by_market: [{ ...stats, sport: "nhl", type: "spread", status: "experimental" }] }
          : { total: 1, picks: [{ id: "pg_sp_nhl_1", date: "2026-11-01", sport: "nhl", type: "spread",
              label: "Bruins +1.5", odds: -150, book: "williamhill_us", book_title: "Caesars",
              close_odds: -165, fair_clv: 2.1, result: "win", profit: 0.67 }] },
      ),
    );
    renderIt();
    expect(await screen.findByText(/Live price-gap picks since 2026-10-18/)).toBeInTheDocument();
    expect(screen.getAllByText("+1.45%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("6-4").length).toBeGreaterThan(0);
    expect(await screen.findByText("-150 Caesars")).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith("/api/public/record/summary?system=price_gap");
  });

  it("explains an empty record instead of showing a blank page", async () => {
    apiFetch.mockResolvedValue({
      since: null, by_market: [], note: "",
      overall: { ...stats, picks: 0, graded: 0, wins: 0, losses: 0 },
    });
    renderIt();
    expect(await screen.findByText(/no price cleared our bar/)).toBeInTheDocument();
  });
});
