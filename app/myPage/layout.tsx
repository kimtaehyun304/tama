"use client";
import { ReactNode, useEffect, useState } from "react";
import MyPageMenuList from "./MyPageMenuList";
import { useRouter } from "next/navigation";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  //레이아웃에 하면 새로고침 전까진 재실행 안되서 api 호출 줄일 수 있음
  useEffect(() => {
    async function checkAdmin() {
      const token = localStorage.getItem("tamaAccessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/isAdmin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const isAdminJson: isAdminResponse = await res.json();

      if (isAdminJson.isAdmin) router.push("/admin/order");
    }
    checkAdmin();
  }, []);

  return (
    <article className="xl:mx-32 m-[2%] flex flex-wrap gap-x-16 gap-y-4 justify-center xl:justify-start">
      <MyPageMenuList />
      {children}
    </article>
  );
}
