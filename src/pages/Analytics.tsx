import { Alert, Tabs, Typography } from "antd";
import AnalyticsOverview from "../components/analytics/AnalyticsOverview";
import HistoricalOverview from "../components/analytics/HistoricalOverview";
import PropsOverview from "../components/analytics/PropsOverview";
import MoneylinesOverview from "../components/analytics/MoneylinesOverview";
import PlayerOverview from "../components/analytics/PlayerOverview";
import ParlayAnalyticsTable from "../components/analytics/ParlayAnalyticsTable";
import TrackRecord from "../components/analytics/TrackRecord";

const { Title } = Typography;

// The condition-mined system these tabs report on was paused 2026-10-17.
function OldSystemNote() {
  return (
    <Alert
      type="warning"
      showIcon
      style={{ marginBottom: 16 }}
      message="Old system, paused October 17, 2026"
      description="These numbers are from the previous pick system. The live record of current picks is on the Track record tab."
    />
  );
}

export default function Analytics() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Analytics</Title>
      <Tabs
        defaultActiveKey="record"
        tabBarStyle={{ overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}
        items={[
          { key: "record", label: "Track record", children: <TrackRecord /> },
          { key: "overview", label: "Old system", children: <><OldSystemNote /><AnalyticsOverview /></> },
          { key: "historical", label: "Historical", children: <><OldSystemNote /><HistoricalOverview /></> },
          { key: "props", label: "Props", children: <><OldSystemNote /><PropsOverview /></> },
          { key: "moneyline", label: "Moneylines", children: <><OldSystemNote /><MoneylinesOverview /></> },
          { key: "players", label: "Players", children: <PlayerOverview /> },
          { key: "parlays", label: "Parlays", children: <><OldSystemNote /><ParlayAnalyticsTable /></> },
        ]}
      />
    </div>
  );
}
