"use client";
import Image from "next/image";
import { useContext } from "react";

import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { LoginModalContext } from "../context/LoginModalContext";


export default () => {
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리
  const authContext = useContext(AuthContext);
  const router = useRouter(); // 페이지 이동을 위한 useRouter

  function handleClick() {
    if (authContext?.isLogined) {
      router.push("/myPage/order");
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
