"use client";
import { useContext, useEffect } from "react";

import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthContext } from "../context/AuthContext";
import { LoginModalContext } from "../context/LoginModalContext";

export default function LoginButton() {
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리
  const authContext = useContext(AuthContext);

  // 새로고침하면 전역상태 사라져서 재설정
  useEffect(() => {
    const accessToken = localStorage.getItem("tamaAccessToken");
    if (accessToken) {
      const decoded: JwtPayload | string | null = jwt.decode(accessToken);
      const now = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

      if (
        decoded &&
        typeof decoded !== "string" &&
        decoded.exp !== undefined &&
        decoded.exp < now
      ) {
        //모달 겹치면 안떠서 alert 사용
        alert("로그인 만료");
        localStorage.removeItem("tamaAccessToken");
        loginModalContext?.setIsOpenLoginModal(true);
        return;
      }
      
      authContext?.setIsLogined(true);
    }
  }, []);

  // typeof !== "undefined" 필요할 것 같았는데 에러 안나네 뭐지 -> onClick function이라 그런듯
  function logout() {
    authContext?.setIsLogined(false);
    localStorage.removeItem("tamaAccessToken");
  }

  return !authContext?.isLogined ? (
    <button
      className=""
      onClick={() => loginModalContext?.setIsOpenLoginModal(true)}
    >
      로그인
    </button>
  ) : (
    <button className="" onClick={() => logout()}>
      로그아웃
    </button>
  );
}
