import { Card, Input, Space, Typography } from "antd";
import { useState } from "react";

import PlayerTable from "./PlayerTable";
import PlayerProfileModal from "./PlayerProfileModal";

const { Title } = Typography;

export default function PlayerOverview() {
  const [search, setSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3}>Players</Title>

      <Card>
        <Input.Search
          placeholder="Search player name"
          allowClear
          onSearch={(value) => setSearch(value)}
          style={{ maxWidth: 320 }}
        />
      </Card>

      <PlayerTable
        search={search}
        onSelectPlayer={(id) => setSelectedPlayerId(id)}
      />

      <PlayerProfileModal
        playerId={selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
      />
    </Space>
  );
}
