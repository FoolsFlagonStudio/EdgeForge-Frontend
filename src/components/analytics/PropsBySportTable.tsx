import { Table, Spin, Alert } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import { winRateTag } from "../../lib/pickTags";

type PropsBySportRow = {
  sport: string;
  total: number;
  wins: number;
  losses: number;
  win_rate: number;
};

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
      scroll={{ x: "max-content" }}
    />
  );
}
