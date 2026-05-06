import { Table, Space, Segmented, Select, Spin, Alert, Typography, Tag } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

const { Text } = Typography;

type ConfidenceRow = {
  confidence: number;
  wins: number;
  total: number;
  win_rate: number;
};

type RollingResponse = {
  days: number;
  sport_filter: string | null;
  cutoff: string;
  props: {
    wins: number;
    losses: number;
    total: number;
    win_rate: number;
  };
  moneylines: {
    wins: number;
    losses: number;
    total: number;
    win_rate: number;
  };
  props_by_confidence: ConfidenceRow[];
};

const DAY_OPTIONS = [7, 14, 30, 60, 90];
const SPORT_OPTIONS = [
  { label: "All Sports", value: "" },
  { label: "NBA", value: "NBA" },
  { label: "MLB", value: "MLB" },
  { label: "NHL", value: "NHL" },
];

function winRateTag(rate: number) {
  const pct = (rate * 100).toFixed(1);
  const color = rate >= 0.6 ? "green" : rate >= 0.5 ? "blue" : "orange";
  return <Tag color={color}>{pct}%</Tag>;
}

const confidenceColumns = [
  { title: "Confidence", dataIndex: "confidence", key: "confidence" },
  {
    title: "Win Rate",
    key: "win_rate",
    render: (_: any, r: ConfidenceRow) => winRateTag(r.win_rate),
  },
  {
    title: "Record",
    key: "record",
    render: (_: any, r: ConfidenceRow) => `${r.wins} / ${r.total}`,
  },
];

export default function RollingPerformanceTable() {
  const [days, setDays] = useState(30);
  const [sport, setSport] = useState("");

  const { data, isLoading, error } = useQuery<RollingResponse>({
    queryKey: ["rolling", days, sport],
    queryFn: () => apiFetch(API_ROUTES.rolling(days, sport || undefined)),
  });

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space wrap>
        <Segmented
          value={days}
          onChange={(v) => setDays(Number(v))}
          options={DAY_OPTIONS.map((d) => ({ label: `${d}d`, value: d }))}
        />
        <Select
          value={sport}
          onChange={setSport}
          options={SPORT_OPTIONS}
          style={{ width: 140 }}
        />
      </Space>

      {isLoading && <Spin />}
      {error && <Alert type="error" message="Failed to load rolling performance" />}

      {data && (
        <>
          <Space size="large">
            <div>
              <Text type="secondary">Props</Text>
              <div>
                {winRateTag(data.props.win_rate)}{" "}
                <Text type="secondary">
                  {data.props.wins}W — {data.props.losses}L
                </Text>
              </div>
            </div>
            <div>
              <Text type="secondary">Moneylines</Text>
              <div>
                {winRateTag(data.moneylines.win_rate)}{" "}
                <Text type="secondary">
                  {data.moneylines.wins}W — {data.moneylines.losses}L
                </Text>
              </div>
            </div>
          </Space>

          {data.props_by_confidence.length > 0 && (
            <Table
              className="dashboard-table"
              dataSource={data.props_by_confidence}
              columns={confidenceColumns}
              rowKey="confidence"
              pagination={false}
              size="small"
            />
          )}

          <Text type="secondary" style={{ fontSize: 12 }}>
            Since {data.cutoff}
            {data.sport_filter ? ` · ${data.sport_filter}` : ""}
          </Text>
        </>
      )}
    </Space>
  );
}
