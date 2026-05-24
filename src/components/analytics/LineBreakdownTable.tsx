import { Table, Tag, Space, Typography } from "antd";
const { Text } = Typography;

type Props = {
  lines: any[];
};

function getBestLineIndex(lines: any[]) {
  const candidates = lines
    .map((l, i) => ({ ...l, i }))
    .filter((l) => Number(l.win_rate) >= 0.75 && l.total >= 3);

  if (!candidates.length) return null;

  return candidates.sort((a, b) => {
    if (Number(b.win_rate) !== Number(a.win_rate)) {
      return Number(b.win_rate) - Number(a.win_rate);
    }
    return b.total - a.total;
  })[0].i;
}

export default function LineBreakdownTable({ lines }: Props) {
  const bestLineIndex = getBestLineIndex(lines);

  return (
    <Table
      size="small"
      pagination={false}
      dataSource={lines.map((l, i) => ({ key: i, ...l, index: i }))}
      columns={[
        {
          title: "Line",
          dataIndex: "line",
          render: (v) => `${v}+`,
        },
        {
          title: "Record",
          render: (_, r) => `${r.wins} / ${r.total}`,
        },
        {
          title: "Win %",
          render: (_, r) => {
            const winPct = Number(r.win_rate) * 100;
            const isBest = r.index === bestLineIndex;
            const lowSample = r.total < 3;

            return (
              <Space>
                <Tag
                  color={
                    lowSample ? "orange" : winPct >= 75 ? "green" : "default"
                  }
                >
                  {winPct.toFixed(1)}%
                </Tag>

                {isBest && <Tag color="gold">BEST</Tag>}

                {lowSample && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    low sample
                  </Text>
                )}
              </Space>
            );
          },
        },
      ]}
    />
  );
}
