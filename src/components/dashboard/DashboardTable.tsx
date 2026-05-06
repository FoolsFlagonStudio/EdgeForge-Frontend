import StraightsTable from "./StraightsTable";
import MoneylinesTable from "./MoneylinesTable";
type Props = {
  betType: "straight" | "moneylines";
  data: any[];
  onPlayerClick: (id: number) => void;
};

export default function DashboardTable({
  betType,
  data,
  onPlayerClick,
}: Props) {
  if (betType === "straight") {
    return <StraightsTable data={data} onPlayerClick={onPlayerClick} />;
  } else if (betType === "moneylines") {
    return <MoneylinesTable data={data} />;
  }
}
