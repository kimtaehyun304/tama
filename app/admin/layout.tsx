"use client";
import { useEffect, useState, ReactNode } from "react";
import NotFoundScreen from "@/components/NotFoundScreen";
import LoadingScreen from "@/components/LoadingScreen";

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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/isAdmin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsAdmin(res.ok);
    }
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <LoadingScreen />;
  }

  if (!isAdmin) return <NotFoundScreen />;

  return <>{children}</>;
}
