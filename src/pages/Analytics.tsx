import { Tabs, Typography } from "antd";
import AnalyticsOverview from "../components/analytics/AnalyticsOverview";
import HistoricalOverview from "../components/analytics/HistoricalOverview";
import PropsOverview from "../components/analytics/PropsOverview";
import MoneylinesOverview from "../components/analytics/MoneylinesOverview";
import PlayerOverview from "../components/analytics/PlayerOverview";
import ParlayAnalyticsTable from "../components/analytics/ParlayAnalyticsTable";

const { Title } = Typography;

export default function Analytics() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Analytics</Title>
      <Tabs
        defaultActiveKey="overview"
        tabBarStyle={{ overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}
        items={[
          { key: "overview", label: "Overview", children: <AnalyticsOverview /> },
          { key: "historical", label: "Historical", children: <HistoricalOverview /> },
          { key: "props", label: "Props", children: <PropsOverview /> },
          { key: "moneyline", label: "Moneylines", children: <MoneylinesOverview /> },
          { key: "players", label: "Players", children: <PlayerOverview /> },
          { key: "parlays", label: "Parlays", children: <ParlayAnalyticsTable /> },
        ]}
      />
    </div>
  );
}
