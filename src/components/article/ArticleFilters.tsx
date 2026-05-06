import { Select, Input } from "antd";

const { Option } = Select;

interface Props {
  sport: string;
  onSportChange: (v: string) => void;
  author: string;
  onAuthorChange: (v: string) => void;
}

export default function ArticleFilters({ sport, onSportChange, author, onAuthorChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      <Select
        value={sport}
        onChange={onSportChange}
        style={{ width: 140 }}
        placeholder="Sport"
      >
        <Option value="">All Sports</Option>
        <Option value="nba">NBA</Option>
        <Option value="nhl">NHL</Option>
        <Option value="mlb">MLB</Option>
      </Select>
      <Input
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        placeholder="Search by author..."
        style={{ width: 220 }}
        allowClear
      />
    </div>
  );
}
