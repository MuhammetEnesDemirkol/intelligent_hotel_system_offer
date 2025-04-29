import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = ({ data }) => {
  if (!data || !data.labels || !data.values || data.labels.length === 0) {
    return <p className="text-center text-muted">Grafik verisi bulunamadı.</p>;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Rezervasyon Sayısı",
        data: data.values,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Haftalık Rezervasyonlar",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DashboardChart;
