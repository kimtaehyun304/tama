"use client";

import { useContext, useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthContext } from "../context/AuthContext";
import { LoginModalContext } from "../context/LoginModalContext";

export default function LoginButton() {
  const loginModalContext = useContext(LoginModalContext);
  const authContext = useContext(AuthContext);

  const [isInitialized, setIsInitialized] = useState(false); // 깜박임 방지용

  useEffect(() => {
    const accessToken = localStorage.getItem("tamaAccessToken");
    if (accessToken) {
      const decoded: JwtPayload | string | null = jwt.decode(accessToken);
      const now = Math.floor(Date.now() / 1000); // 초 단위 시간

      if (
        decoded &&
        typeof decoded !== "string" &&
        decoded.exp !== undefined &&
        decoded.exp < now
      ) {
        // 만료된 토큰
        alert("로그인 만료");
        localStorage.removeItem("tamaAccessToken");
        loginModalContext?.setIsOpenLoginModal(true);
      } else {
        authContext?.setIsLogined(true); // 유효한 토큰 → 로그인 처리
      }
    }
    setIsInitialized(true); // ✅ 초기화 완료 후에만 렌더링
  }, []);

  function logout() {
    authContext?.setIsLogined(false);
    localStorage.removeItem("tamaAccessToken");
  }

  // 초기화 전에는 아무 것도 렌더링하지 않음 (깜박임 방지)
  if (!isInitialized) return null;

  return !authContext?.isLogined ? (
    <button onClick={() => loginModalContext?.setIsOpenLoginModal(true)}>
      로그인
    </button>
  ) : (
    <button onClick={logout}>로그아웃</button>
  );
}
