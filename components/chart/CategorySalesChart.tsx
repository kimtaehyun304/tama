"use client";

import "./chart";
import { Doughnut } from "react-chartjs-2";

export default ({ data }: { data: CategorySale[] }) => {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
  ];

  return (
    <div className="h-[300px]">
      <Doughnut
        data={{
          labels: data.map((d) => d.categoryName),
          datasets: [
            {
              data: data.map((d) => d.orderTotal),
              backgroundColor: data.map((_, i) => colors[i % colors.length]),
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true, // 제목 표시
              text: "카테고리별 매출", // 제목 내용
              font: {
                size: 18, // 글자 크기
                weight: "bold", // 글자 굵기
              },
              color: "#111", // 글자 색상
              padding: {
                top: 10,
                bottom: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const index = ctx.dataIndex;
                  const category = data[index];

                  // 부모 카테고리 정보
                  const lines = [
                    `${category.categoryName}: ${category.orderTotal.toLocaleString()}원 / ${category.orderCount}건`,
                  ];

                  // 자식 카테고리 정보
                  if (category.children && category.children.length > 0) {
                    lines.push("자식 카테고리:");
                    category.children.forEach((child) => {
                      lines.push(
                        `  ${child.categoryName}: ${child.orderTotal.toLocaleString()}원 / ${child.orderCount}건`,
                      );
                    });
                  }

                  return lines; // 문자열 배열로 반환
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
