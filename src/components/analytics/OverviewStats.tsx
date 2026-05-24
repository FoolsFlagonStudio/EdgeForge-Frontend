import { Card, Col, Row, Statistic } from "antd";

type OverallStats = {
  wins: number;
  losses: number;
  total: number;
  win_rate: string;
};

type Props = {
  overall?: OverallStats | null;
  confidenceWeighted?: string | null;
};

export default function OverviewStats({ overall, confidenceWeighted }: Props) {
  if (!overall) {
    return null;
  }

  const overallWinRate = Number(overall.win_rate) * 100;
  const weightedWinRate = confidenceWeighted
    ? Number(confidenceWeighted) * 100
    : null;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Overall Win Rate"
            value={overallWinRate}
            precision={1}
            suffix="%"
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card>
          <Statistic
            title="Confidence-Weighted Win Rate"
            value={weightedWinRate ?? 0}
            precision={1}
            suffix="%"
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card>
          <Statistic title="Total Bets" value={overall.total} />
        </Card>
      </Col>
    </Row>
  );
}
