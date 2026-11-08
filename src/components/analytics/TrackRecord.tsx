import { Alert, Card, Col, Row, Spin, Statistic, Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

// Live record of the current price-gap picks (published since 2026-10-18).
// The old condition-mined system is paused and lives in the other tabs.

type Stats = {
  picks: number;
  graded: number;
  wins: number;
  losses: number;
  pushes: number;
  units: number;
  roi: number | null;
  win_rate: number | null;
  breakeven_rate: number | null;
  fair_clv: number | null;
  clv_t: number | null;
  clv_n: number;
  clv_bar_met: boolean;
};

type MarketRow = Stats & { sport: string; type: string; status: string | null };

type SummaryResponse = {
  since: string | null;
  overall: Stats;
  by_market: MarketRow[];
  note: string;
};

type PickRow = {
  id: string;
  date: string;
  sport: string;
  type: string;
  label: string;
  odds: number | null;
  book: string | null;
  book_title?: string | null;
  close_odds: number | null;
  fair_clv: number | null;
  result: string | null;
  profit: number | null;
};

type PicksResponse = { total: number; picks: PickRow[] };

const pct = (v: number | null | undefined, digits = 1) =>
  v == null ? "—" : `${(v * 100).toFixed(digits)}%`;
const odds = (v: number | null | undefined) => (v == null ? "—" : v > 0 ? `+${v}` : `${v}`);
const units = (v: number | null | undefined) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(2)}u`;
// fair_clv comes back already in percent (e.g. 1.45 = +1.45%)
const clv = (v: number | null | undefined) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

function resultTag(r: string | null) {
  if (r == null) return <Tag>Pending</Tag>;
  const color = r === "win" ? "green" : r === "loss" ? "red" : "default";
  return <Tag color={color}>{r.toUpperCase()}</Tag>;
}

export default function TrackRecord() {
  const summary = useQuery<SummaryResponse>({
    queryKey: ["record-summary"],
    queryFn: () => apiFetch(API_ROUTES.recordSummary),
  });
  const picks = useQuery<PicksResponse>({
    queryKey: ["record-picks"],
    queryFn: () => apiFetch(API_ROUTES.recordPicks(200, 0)),
  });

  if (summary.isLoading) return <Spin />;
  if (summary.error || !summary.data)
    return <Alert type="error" message="Failed to load the track record" />;

  const { overall, by_market, since, note } = summary.data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Alert
        type="info"
        showIcon
        message={`Live price-gap picks${since ? ` since ${since}` : ""}`}
        description={note}
      />

      {overall.picks === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          No picks yet. Days with no picks mean no price cleared our bar.
        </p>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Fair CLV"
                  value={clv(overall.fair_clv)}
                  valueStyle={{ color: overall.clv_bar_met ? "var(--success, #3f8600)" : undefined }}
                />
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  t = {overall.clv_t ?? "—"} over {overall.clv_n} picks
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Record"
                  value={`${overall.wins}-${overall.losses}${overall.pushes ? `-${overall.pushes}` : ""}`}
                />
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {overall.graded} of {overall.picks} graded
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic title="Units" value={units(overall.units)} />
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  ROI {pct(overall.roi)}
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic title="Win rate" value={pct(overall.win_rate)} />
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  break-even {pct(overall.breakeven_rate)}
                </div>
              </Card>
            </Col>
          </Row>

          <Table<MarketRow>
            size="small"
            rowKey={(r) => `${r.sport}-${r.type}`}
            pagination={false}
            scroll={{ x: true }}
            dataSource={by_market}
            columns={[
              { title: "Sport", dataIndex: "sport", render: (v: string) => v.toUpperCase() },
              { title: "Market", dataIndex: "type" },
              {
                title: "Status",
                dataIndex: "status",
                render: (v: string | null) =>
                  v ? <Tag color={v === "active" ? "green" : "gold"}>{v}</Tag> : "—",
              },
              { title: "Picks", dataIndex: "picks" },
              { title: "Fair CLV", render: (_, r) => `${clv(r.fair_clv)} (t ${r.clv_t ?? "—"})` },
              { title: "Record", render: (_, r) => `${r.wins}-${r.losses}` },
              { title: "Units", render: (_, r) => units(r.units) },
              { title: "ROI", render: (_, r) => pct(r.roi) },
            ]}
          />

          <Table<PickRow>
            size="small"
            rowKey="id"
            loading={picks.isLoading}
            scroll={{ x: true }}
            dataSource={picks.data?.picks ?? []}
            pagination={{ pageSize: 25 }}
            columns={[
              { title: "Date", dataIndex: "date" },
              { title: "Sport", dataIndex: "sport", render: (v: string) => v.toUpperCase() },
              { title: "Pick", dataIndex: "label" },
              {
                title: "Price",
                render: (_, r) => `${odds(r.odds)} ${r.book_title ?? r.book ?? ""}`.trim(),
              },
              { title: "Close", render: (_, r) => odds(r.close_odds) },
              { title: "CLV", render: (_, r) => clv(r.fair_clv) },
              { title: "Result", render: (_, r) => resultTag(r.result) },
              { title: "Units", render: (_, r) => units(r.profit) },
            ]}
          />
        </>
      )}
    </div>
  );
}
