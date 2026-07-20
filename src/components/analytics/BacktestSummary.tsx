import { Card, Spin, Alert, Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

type SeasonStats = {
  picks: number;
  wins: number;
  losses: number;
  win_pct: number;
  units_pnl: number;
  roi_pct: number;
};

type MarketData = {
  by_season: Record<string, SeasonStats>;
  all_seasons: SeasonStats;
};

type BacktestData = {
  generated_at: string;
  note: string;
  sports: {
    mlb: {
      totals: MarketData;
      moneylines: MarketData;
      runlines: MarketData;
    };
    wnba: {
      moneylines: MarketData;
      totals: MarketData;
    };
  };
};

type FlatRow = {
  key: string;
  sport: string;
  market: string;
  seasons: string;
  picks: number;
  win_pct: number;
  units_pnl: number;
  roi_pct: number;
};

const MARKET_LABELS: Record<string, string> = {
  totals: "Totals (O/U)",
  moneylines: "Moneylines",
  runlines: "Run Lines",
};

const MARKET_ORDER = ["totals", "moneylines", "runlines"];

function flatten(data: BacktestData): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const [sport, markets] of Object.entries(data.sports)) {
    for (const marketKey of MARKET_ORDER) {
      const market = (markets as Record<string, MarketData>)[marketKey];
      if (!market) continue;
      const seasons = Object.keys(market.by_season).sort();
      const seasonLabel =
        seasons.length <= 2
          ? seasons.join(", ")
          : `${seasons[0]}–${seasons[seasons.length - 1]}`;
      rows.push({
        key: `${sport}-${marketKey}`,
        sport: sport.toUpperCase(),
        market: MARKET_LABELS[marketKey] ?? marketKey,
        seasons: seasonLabel,
        picks: market.all_seasons.picks,
        win_pct: market.all_seasons.win_pct,
        units_pnl: market.all_seasons.units_pnl,
        roi_pct: market.all_seasons.roi_pct,
      });
    }
  }
  return rows;
}

const columns = [
  {
    title: "Sport",
    dataIndex: "sport",
    key: "sport",
    width: 80,
    render: (v: string) => <Tag color="blue">{v}</Tag>,
  },
  { title: "Market", dataIndex: "market", key: "market", width: 130 },
  { title: "Seasons", dataIndex: "seasons", key: "seasons", width: 110 },
  {
    title: "Picks",
    dataIndex: "picks",
    key: "picks",
    width: 80,
    align: "right" as const,
    render: (v: number) => (v === 0 ? <span style={{ color: "#888" }}>—</span> : v),
  },
  {
    title: "Win %",
    dataIndex: "win_pct",
    key: "win_pct",
    width: 90,
    align: "right" as const,
    render: (v: number) =>
      v === 0 ? (
        <span style={{ color: "#888" }}>—</span>
      ) : (
        <span>{v.toFixed(1)}%</span>
      ),
  },
  {
    title: "Units P&L",
    dataIndex: "units_pnl",
    key: "units_pnl",
    width: 110,
    align: "right" as const,
    render: (v: number) =>
      v === 0 ? (
        <span style={{ color: "#888" }}>—</span>
      ) : (
        <span style={{ color: v >= 0 ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
          {v >= 0 ? "+" : ""}
          {v.toFixed(1)}u
        </span>
      ),
  },
  {
    title: "ROI",
    dataIndex: "roi_pct",
    key: "roi_pct",
    width: 90,
    align: "right" as const,
    render: (v: number) =>
      v === 0 ? (
        <span style={{ color: "#888" }}>—</span>
      ) : (
        <Tag color={v >= 0 ? "green" : "red"}>
          {v >= 0 ? "+" : ""}
          {v.toFixed(1)}%
        </Tag>
      ),
  },
];

export default function BacktestSummary() {
  const { data, isLoading, error } = useQuery<BacktestData>({
    queryKey: ["backtest-summary"],
    queryFn: () => apiFetch(API_ROUTES.backtestSummary),
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) return <Spin />;
  if (error || !data)
    return (
      <Alert
        type="error"
        message="Failed to load backtest data"
        description="Historical performance summary unavailable."
      />
    );

  const rows = flatten(data);

  return (
    <Card
      title={
        <>
          Historical Model Backtests
          <Typography.Text
            type="secondary"
            style={{ display: "block", fontSize: 12 }}
          >
            Per-pick 1u flat bet at FanDuel opening odds. Filters mirror live
            pipeline logic. Generated: {data.generated_at}
          </Typography.Text>
        </>
      }
    >
      <Table
        className="dashboard-table"
        dataSource={rows}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
      />
      <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 8 }}>
        {data.note}
      </Typography.Text>
    </Card>
  );
}
