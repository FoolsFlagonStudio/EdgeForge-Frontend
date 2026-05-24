import { Tag } from "antd";

export function resultTag(result: string | null) {
  if (!result) return <Tag>Pending</Tag>;
  if (result === "win") return <Tag color="green">Win</Tag>;
  if (result === "loss") return <Tag color="red">Loss</Tag>;
  return <Tag>Push</Tag>;
}

export function confidenceTag(confidence: number | null | undefined) {
  if (confidence == null) return <Tag>—</Tag>;
  const config: Record<number, { color: string; label: string }> = {
    5: { color: "green",  label: "5 — Core" },
    4: { color: "cyan",   label: "4 — Strong" },
    3: { color: "gold",   label: "3 — Value" },
    2: { color: "orange", label: "2 — Weak" },
    1: { color: "red",    label: "1 — Speculative" },
  };
  const c = config[confidence];
  return c ? <Tag color={c.color}>{c.label}</Tag> : <Tag>{confidence}</Tag>;
}

export function winRateTag(rate: number) {
  const pct = (rate * 100).toFixed(1);
  const color = rate >= 0.55 ? "green" : rate >= 0.5 ? "blue" : "orange";
  return <Tag color={color}>{pct}%</Tag>;
}
