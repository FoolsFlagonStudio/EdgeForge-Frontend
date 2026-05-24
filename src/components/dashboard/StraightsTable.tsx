import { Table, Tag } from "antd";

type Props = {
  data: any[];
  onPlayerClick: (id: number) => void;
};

export default function StraightsTable({ data, onPlayerClick }: Props) {
  const marketFilters = Array.from(new Set(data.map((d) => d.market))).map(
    (m) => {
      const row = data.find((d) => d.market === m);
      return {
        text: row?.market_label ?? (m as string).toUpperCase(),
        value: m,
      };
    },
  );

  const columns = [
    {
      title: "Player",
      dataIndex: "player",
      sorter: (a: any, b: any) =>
        (a.player ?? "").localeCompare(b.player ?? ""),
      render: (_: any, r: any) =>
        r.player ? (
          <span
            className="player-link"
            onClick={() => onPlayerClick(r.player_id)}
          >
            {r.player}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Sport",
      dataIndex: "sport",
      filters: [
        { text: "NBA", value: "NBA" },
        { text: "MLB", value: "MLB" },
        { text: "NHL", value: "NHL" },
      ],
      onFilter: (value: any, record: any) => record.sport === value,
      render: (s: string) => <Tag>{s}</Tag>,
    },
    {
      title: "Market",
      dataIndex: "market",
      filters: marketFilters,
      onFilter: (value: any, record: any) => record.market === value,
      render: (m: string, r: any) => r.market_label ?? m.toUpperCase(),
    },
    {
      title: "Line",
      dataIndex: "display_line",
      render: (v: string | null, r: any) =>
        v ?? (r.line != null ? `${r.line}+` : "—"),
    },
    {
      title: "Confidence",
      dataIndex: "confidence",
      filters: [
        { text: "5", value: 5 },
        { text: "4", value: 4 },
        { text: "3", value: 3 },
        { text: "2", value: 2 },
        { text: "1", value: 1 },
      ],
      onFilter: (value: any, record: any) => record.confidence === value,
      sorter: (a: any, b: any) => a.confidence - b.confidence,
    },
    {
      title: "Trust",
      sorter: (a: any, b: any) =>
        (a.player_trust ?? -1) - (b.player_trust ?? -1),
      render: (_: any, r: any) => {
        if (r.player_trust == null) {
          return <Tag color="default">No data</Tag>;
        }

        return (
          <Tag
            color={
              r.trust_tier === "high"
                ? "green"
                : r.trust_tier === "medium"
                  ? "blue"
                  : "orange"
            }
          >
            {r.player_trust}%
          </Tag>
        );
      },
    },
    {
      title: "Risk",
      dataIndex: "risk",
      filters: [
        { text: "Core", value: "core" },
        { text: "Strong", value: "strong" },
        { text: "Acceptable", value: "acceptable" },
        { text: "Weak", value: "weak" },
        { text: "Speculative", value: "speculative" },
      ],
      onFilter: (value: any, record: any) => record.risk === value,
      render: (r: string) => <Tag className={`risk-tag risk-${r}`}>{r}</Tag>,
    },
    {
      title: "Flags",
      filters: [{ text: "Low sample", value: "low_sample" }],
      onFilter: (_: any, r: any) => r.low_sample === true,
      render: (_: any, r: any) =>
        r.low_sample ? <Tag color="orange">Low sample</Tag> : null,
    },
  ];

  return (
    <Table
      className="dashboard-table"
      rowKey="bet_id"
      columns={columns}
      dataSource={data}
      pagination={{
        defaultPageSize: 50,
        pageSizeOptions: ["25", "50", "100"],
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
      }}
      scroll={{ x: "max-content" }}
    />
  );
}
