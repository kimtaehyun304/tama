"use client";
import { ReactNode, useContext, useEffect } from "react";
import MyPageMenuList from "./MyPageMenuList";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/context/AuthContext";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  //레이아웃에 하면 새로고침 전까진 재실행 안되서 api 호출 줄일 수 있음
  useEffect(() => {
    if (!authContext?.isLogined) return;

    async function checkAdmin() {
      const token = localStorage.getItem("tamaAccessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/isAdmin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const isAdminJson: isAdminResponse = await res.json();

      if (isAdminJson.isAdmin) router.push("/admin/order");
    }
    checkAdmin();
  }, [authContext?.isLogined]);

  return (
    <article className="xl:mx-32 m-[2%] xl:flex gap-x-16 ">
      {authContext?.isLogined && <MyPageMenuList />}
      {children}
    </article>
  );
}
