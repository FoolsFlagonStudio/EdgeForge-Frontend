import { Alert, Card, Space, Spin, Typography, Row, Col } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { MoneylineBySportRow } from "./../../types/moneylines";
import MoneylineEdgeBucketsTable from "./MoneylineEdgeBucketsTable";
import MoneylineCalibrationChart from "./MoneylineCalibrationChart";
import MoneylineBySportTable from "./MoneylineBySportTable";

const { Title, Text } = Typography;

export type MoneylineEdgeBucketRow = {
  edge_bucket: string;
  total: number;
  wins: number;
  win_rate: string;
};

export type MoneylineCalibrationRow = {
  model_bucket: number;
  total: number;
  wins: number;
  actual_win_rate: string;
};

export default function MoneylinesOverview() {
  const edgeQ = useQuery<MoneylineEdgeBucketRow[]>({
    queryKey: ["ml-edge-buckets"],
    queryFn: () => apiFetch(API_ROUTES.moneylineEdgeBuckets),
  });

  const calibQ = useQuery<MoneylineCalibrationRow[]>({
    queryKey: ["ml-calibration"],
    queryFn: () => apiFetch(API_ROUTES.moneylineCalibration),
  });

  const sportQ = useQuery<MoneylineBySportRow[]>({
    queryKey: ["ml-by-sport"],
    queryFn: () => apiFetch(API_ROUTES.moneylineBySport),
  });

  if (edgeQ.isLoading || calibQ.isLoading || sportQ.isLoading) return <Spin />;

  if (edgeQ.error || calibQ.error || sportQ.error) {
    console.log(edgeQ, calibQ.error, sportQ.error)
    return (
      <Alert
        type="error"
        message="Failed to load moneyline analytics"
        description="One or more moneyline endpoints failed."
      />
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3}>Moneyline Analytics</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Edge Buckets"
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                Higher edge buckets should generally win more often.
              </Text>
            }
          >
            <MoneylineEdgeBucketsTable data={edgeQ.data ?? []} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="By Sport"
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                Aggregated performance across sports for resolved moneylines.
              </Text>
            }
          >
            <MoneylineBySportTable data={sportQ.data ?? []} />
          </Card>
        </Col>
      </Row>

      <Card
        title="Calibration"
        extra={
          <Text type="secondary" style={{ fontSize: 12 }}>
            Compares model probability buckets vs actual win rate.
          </Text>
        }
      >
        <MoneylineCalibrationChart data={calibQ.data ?? []} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Early buckets may appear volatile due to small sample sizes.
        </Text>
      </Card>

      <Text type="secondary" style={{ fontSize: 12 }}>
        Moneyline analytics include resolved bets only. Edge represents model
        probability minus implied probability from the line.
      </Text>
    </Space>
  );
}
