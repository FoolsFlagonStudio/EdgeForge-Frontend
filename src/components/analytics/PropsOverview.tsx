import { Space, Card, Typography } from "antd";
import PropsBySportTable from "./PropsBySportTable";
import RollingPerformanceTable from "./RollingPerformanceTable";
import TopPlayersTable from "./TopPlayersTable";

const { Title } = Typography;

export default function PropsOverview() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3}>Props Analytics</Title>

      <Card title="Performance by Sport">
        <PropsBySportTable />
      </Card>

      <Card title="Rolling Performance">
        <RollingPerformanceTable />
      </Card>

      <Card title="Top Performers (Recent)">
        <TopPlayersTable />
      </Card>
    </Space>
  );
}
