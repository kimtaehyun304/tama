"use client";

import { Chart } from "react-chartjs-2";
import "./chart.ts";

export default ({ data }: { data: MonthSale[] }) => {
  const labels = data.map((d) => d.orderDate.toString().slice(5));
  const sales = data.map((d) => d.orderTotal);
  const orders = data.map((d) => d.orderCount);

  return (
    <Chart
      type="bar"
      data={{
        labels,
        datasets: [
          {
            type: "bar",
            label: "매출",
            data: sales,
            yAxisID: "y",
            backgroundColor: "rgba(54, 162, 235, 0.6)", // 파란색
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            type: "line",
            label: "주문 수",
            data: orders,
            yAxisID: "y1",
            tension: 0.4,
            borderColor: "rgba(255, 206, 86, 1)", // 노란색
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            pointBackgroundColor: "rgba(255, 206, 86, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 206, 86, 1)",
          },
        ],
      }}
      options={{
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          title: {
            display: true, 
            text: "월별 매출", 
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#111",
            padding: { top: 10, bottom: 20 },
          },
          legend: { position: "top" },
        },
        scales: {
          y: {
            ticks: {
              callback: (v) => Number(v).toLocaleString() + "원",
            },
          },
          y1: {
            position: "right",
            grid: { drawOnChartArea: false },
          },
        },
      }}
    />
  );
};
