import { Segmented } from "antd";

type Props = {
  betType: "straight" | "moneylines";
  onChange: (v: "straight" | "moneylines") => void;
};

export default function DashboardHeader({ betType, onChange }: Props) {
  return (
    <Segmented
      options={[
        { label: "Straights", value: "straight" },
        { label: "Moneylines", value: "moneylines" },
      ]}
      value={betType}
      onChange={(v) => onChange(v as any)}
      style={{ marginBottom: 16 }}
    />
  );
}
