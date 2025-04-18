"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

export default () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>();

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 서버 전송

    if (!email) {
      setMessage("아이디 (이메일주소)를 입력해주세요.");
      //simpleModalContext?.setMessage("아이디 (이메일주소)를 입력해주세요.");
      //simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (!password) {
      setMessage("비밀번호를 입력해주세요.");
      //simpleModalContext?.setMessage("비밀번호를 입력해주세요.");
      //simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    async function fetchAccessToken() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );
      const data: AccessTokenType = await res.json();
      if (res.status !== 200) {
        setMessage(data.message);
        return;
      }
      localStorage.setItem("tamaAccessToken", data.accessToken);
      authContext?.setIsLogined(true);
    }
    fetchAccessToken();
  };

  return (
    <section className="flex justify-center grow">

      <div className="p-10 pb-0">
        <h5 className="text-4xl font-bold text-center py-3">로그인</h5>
        <form onSubmit={login}>
          <input
            className="border p-2 w-full mb-3"
            type="email"
            placeholder="아이디 (이메일주소)"
            name="email"
            onChange={(event) => {
              onChangeInput(event);
              setMessage("");
            }}
          />
          <input
            className="border p-2 w-full mb-3"
            type="password"
            placeholder="비밀번호"
            name="password"
            onChange={(event) => {
              onChangeInput(event);
              setMessage("");
            }}
          />
          <div className="text-center text-red-400">{message}</div>
          <div className="flex justify-between mb-4">
            <span>
              <input className="border mr-1" type="checkbox" id="checkbox" />
              <label htmlFor="checkbox">아이디 저장</label>
            </span>
            <Link href={"/"} className="underline text-[#787878]">
              ID/PW 찾기
            </Link>
          </div>

          <div className="text-center bg-black">
            <button className="text-white w-full p-4" type="submit">
              로그인
            </button>
          </div>
        </form>

        <div className="text-center m-3">
          <Link
            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/oauth2/authorization/google`}
          >
            <button>
              <Image
                src="/icon/icon-google.png"
                width={48}
                height={48}
                alt="icon-google.png"
              />
            </button>
          </Link>
        </div>

        <Link href={"/signup"}>
          <div className="text-center border">
            <button className="p-4 w-full">회원가입</button>
          </div>
        </Link>
        <div className="flex justify-center gap-x-5 py-5">
          <>
            <Link href={"/order"} className="relative underline text-[#787878]">
              비회원 주문하기
            </Link>
            <span className="text-[#e0e0e0]">｜</span>
          </>

          <Link href={"/"} className="underline text-[#787878]">
            비회원 주문조회
          </Link>
        </div>
      </div>
    </section>
  );
};
