"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";

import { tree } from "next/dist/build/templates/app-page";
import { LoginModalContext } from "../context/LoginModalContext";
import { AuthContext } from "../context/AuthContext";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SimpleModalContext } from "../context/SimpleModalContex";
import { useRouter } from "next/navigation";

const Button = (
  <div className="grid justify-items-center">
    <Image src="/icon/icon-person.png" alt="mypae" width={30} height={30} />
    <div className="">마이페이지</div>
  </div>
);

export default () => {
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리
  const simpleModalContext = useContext(SimpleModalContext); // 모달 상태 관리
  const authContext = useContext(AuthContext);
  const router = useRouter(); // 페이지 이동을 위한 useRouter

  function handleClick() {
    if (authContext?.isLogined) {
      router.push("/myPage");
    } else {
      loginModalContext?.setIsOpenLoginModal(true);
    }
  }

  return (
    <button className="grid justify-items-center" onClick={handleClick}>
      <Image src="/icon/icon-person.png" alt="mypae" width={30} height={30} />
      <div className="">마이페이지</div>
    </button>
  );
};
