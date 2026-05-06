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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type ModelTrustRow = {
  date: string;
  trust_all: number;
  trust_core: number;
  weights: {
    props: number;
    moneylines: number;
    parlays: number;
  };
};

export default function ModelTrustChart({ data }: { data: ModelTrustRow[] }) {
  if (!data || data.length === 0) return null;

  // Sort oldest → newest for time series
  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const labels = sorted.map((r) => r.date.slice(5)); // MM-DD

  const chartData = {
    labels,
    datasets: [
      {
        label: "Overall Model Trust",
        data: sorted.map((r) => r.trust_all),
        borderColor: "#c05600",
        backgroundColor: "rgba(192, 86, 0, 0.15)",
        tension: 0.35,
      },
      {
        label: "Core Picks Trust",
        data: sorted.map((r) => r.trust_core),
        borderColor: "#52c41a",
        backgroundColor: "rgba(82,196,26,0.15)",
        tension: 0.35,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;
            if (value == null) return "";

            return `${ctx.dataset.label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (v) => `${v}%`,
        },
      },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
