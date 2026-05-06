import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { MoneylineCalibrationRow } from "./MoneylinesOverview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function MoneylineCalibrationChart({
  data,
}: {
  data: MoneylineCalibrationRow[];
}) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.model_bucket - b.model_bucket);

  const labels = sorted.map((r) => Number(r.model_bucket).toFixed(2));
  const actual = sorted.map((r) => Number(r.actual_win_rate) * 100);
  const ideal = sorted.map((r) => r.model_bucket * 100);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual Win Rate",
        data: actual,
        borderColor: "#c05600",
        tension: 0.25,
      },
      {
        label: "Perfect Calibration",
        data: ideal,
        borderColor: "#bfbfbf",
        borderDash: [6, 6],
        tension: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            if (v == null) return "";
            return `${ctx.dataset.label}: ${v.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
      },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
