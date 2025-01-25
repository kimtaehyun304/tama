"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";

import { tree } from "next/dist/build/templates/app-page";
import { LoginModalContext } from "../context/LoginModalContext";
import { AuthContext } from "../context/AuthContext";

export default function LoginButton() {
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리
  const authContext = useContext(AuthContext);

  // 새로고침하면 전역상태 사라져서 재설정
  useEffect(() => {
    const accessToken = localStorage.getItem("tamaAccessToken");
    if (accessToken) authContext?.setIsLogined(true);
  }, []);

  // typeof !== "undefined" 필요할 것 같았는데 에러 안나네 뭐지
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
