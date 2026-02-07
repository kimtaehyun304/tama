"use client";
import { useEffect, useState, ReactNode } from "react";
import NotFoundScreen from "@/components/NotFoundScreen";
import LoadingScreen from "@/components/LoadingScreen";
import AdminMenuList from "./AdminMenuList";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const token = localStorage.getItem("tamaAccessToken");

      if (!token) {
        setIsAdmin(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/isAdmin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const isAdminJson: isAdminResponse = await res.json();
      setIsAdmin(isAdminJson.isAdmin);
    }
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <LoadingScreen />;
  }

  if (!isAdmin) return <NotFoundScreen />;

  return (
    <article className="xl:mx-32 m-[2%] xl:flex gap-x-16 ">
      <AdminMenuList />
      {children}
    </article>
  );
}
