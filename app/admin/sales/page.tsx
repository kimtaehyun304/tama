"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/context/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import MonthlySalesChart from "@/components/chart/MonthlySalesChart";
import CategorySalesChart from "@/components/chart/CategorySalesChart";

export default () => {
  const authContext = useContext(AuthContext);
  const [monthlySales, setMonthlySales] = useState<MonthSale[]>([]);
  const [parentCategorySales, setParentCategorySales] = useState<
    CategorySale[]
  >([]);
  // 오늘 날짜
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0~11
  const defaultValue = `${year}-${month}`;

  const [selectedMonth, setSelectedMonth] = useState(defaultValue);

  if (!authContext?.isLogined) {
    return <LoginScreen />;
  }

  async function fetchMonthlySales() {
    if (authContext?.isLogined) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/sales?yearMonth=${selectedMonth}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
        },
      );
      const resJson: AdminSalesResponse = await res.json();
      if (!res.ok) return;
      setMonthlySales(resJson.monthSales);
      setParentCategorySales(resJson.categorySales);
    }
  }
  useEffect(() => {
    fetchMonthlySales();
  }, [authContext?.isLogined]);

  return (
    <section className="grow">
      <div className="flex items-center gap-2">
        <input
          type="month"
          className="border rounded px-2 py-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => fetchMonthlySales()} 
        >
          검색
        </button>
      </div>
      <section className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <MonthlySalesChart data={monthlySales} />
        </div>
        <div className="flex-1">
          <CategorySalesChart data={parentCategorySales} />
        </div>
      </section>
    </section>
  );
};
