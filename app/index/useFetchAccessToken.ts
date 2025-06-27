"use client";

import { useEffect, useContext } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AuthContext } from "@/components/context/AuthContext";

export function useFetchAccessToken() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tempToken = searchParams.get("tempToken");
  const authContext = useContext(AuthContext);

  //tempToken파라미터가 사라지기전에 새로고침하면 alert 발생
  useEffect(() => {
    if (tempToken) {
      router.replace(pathname);
      async function fetchAccessToken() {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/access-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tempToken: tempToken }),
          }
        );
        const data: AccessTokenType = await res.json();
        if (res.status !== 200) {
          alert(data.message);
          return;
        }
        localStorage.setItem("tamaAccessToken", data.accessToken);
        authContext?.setIsLogined(true);
      }
      fetchAccessToken();
    }
  }, []);
}
