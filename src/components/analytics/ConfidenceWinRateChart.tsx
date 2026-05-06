import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type ConfidenceRow = {
  confidence: number;
  win_rate: string;
  total: number;
  wins: number;
};

type Props = {
  confidence: ConfidenceRow[];
};

const CONFIDENCE_COLORS: Record<number, string> = {
  5: "#2ecc71",
  4: "#8bc34a",
  3: "#f1c40f",
  2: "#e67e22",
  1: "#e74c3c",
};

export default function ConfidenceWinRateChart({ confidence }: Props) {
  if (!confidence || confidence.length === 0) {
    return null;
  }

  const sorted = [...confidence].sort((a, b) => b.confidence - a.confidence);

  const labels = sorted.map((c) => `Confidence ${c.confidence}`);
  const dataPoints = sorted.map((c) => Number(c.win_rate) * 100);

  const data = {
    labels,
    datasets: [
      {
        label: "Win Rate (%)",
        data: dataPoints,
        backgroundColor: confidence.map(
          (row) => CONFIDENCE_COLORS[row.confidence],
        ),
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items: any) => items[0].label,
          label: (context: any) => {
            const index = context.dataIndex;
            const row = confidence[index];

            return [
              `Win Rate: ${(Number(row.win_rate) * 100).toFixed(1)}%`,
              `Wins: ${row.wins}`,
              `Total Bets: ${row.total}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div style={{ height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
