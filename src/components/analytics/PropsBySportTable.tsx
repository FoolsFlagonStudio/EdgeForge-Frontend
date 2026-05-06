import { Table, Tag, Spin, Alert } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";

type PropsBySportRow = {
  sport: string;
  total: number;
  wins: number;
  losses: number;
  win_rate: number;
};

function winRateTag(rate: number) {
  const pct = (rate * 100).toFixed(1);
  const color = rate >= 0.6 ? "green" : rate >= 0.5 ? "blue" : "orange";
  return <Tag color={color}>{pct}%</Tag>;
}

export default function PropsBySportTable() {
  const { data, isLoading, error } = useQuery<PropsBySportRow[]>({
    queryKey: ["props-by-sport"],
    queryFn: () => apiFetch(API_ROUTES.propsBySport),
  });

  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" message="Failed to load props by sport" />;

  const columns = [
    { title: "Sport", dataIndex: "sport", key: "sport" },
    {
      title: "Win Rate",
      key: "win_rate",
      render: (_: any, r: PropsBySportRow) => winRateTag(r.win_rate),
    },
    {
      title: "Record",
      key: "record",
      render: (_: any, r: PropsBySportRow) => `${r.wins} / ${r.total}`,
    },
    { title: "Total", dataIndex: "total", key: "total" },
  ];

  return (
    <Table
      className="dashboard-table"
      dataSource={data ?? []}
      columns={columns}
      rowKey="sport"
      pagination={false}
      size="small"
    />
  );
}
