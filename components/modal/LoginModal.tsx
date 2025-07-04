"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoginModalContext } from "../context/LoginModalContext";


export default function LoginModal() {
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>();
  const router = useRouter();

  const closeModal = () => {
    loginModalContext?.setIsOpenLoginModal(false);
    loginModalContext?.setIsContainOrder(false);
  };

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
      document.cookie = `tamaAccessToken=${data.accessToken}; path=/; max-age=3600; secure`;

      authContext?.setIsLogined(true);
      closeModal();
    }
    fetchAccessToken();
  };

  if (!loginModalContext?.isOpenLoginModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article>
      <section className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 px-3">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          {/* Modal Header */}
          <div className="flex justify-between border-b px-4 py-3">
            <h5 className="text-lg font-medium">로그인</h5>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
              onClick={closeModal} // 닫기 버튼 동작
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-10 pb-0">
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
                  <input
                    className="border mr-1"
                    type="checkbox"
                    id="checkbox"
                  />
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
              <div className="text-center border" onClick={closeModal}>
                <button className="p-4 w-full">회원가입</button>
              </div>
            </Link>
            <div className="flex justify-center gap-x-1 py-5">
              {loginModalContext.isContainOrder && (
                <>
                  <Link
                    href={"/order"}
                    className="relative underline text-[#787878]"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    비회원 주문하기
                  </Link>
                  <span className="text-[#e0e0e0]">｜</span>
                </>
              )}
              <button
                onClick={() => {
                  loginModalContext.setIsOpenLoginModal(false);
                  router.push("/guest");
                }}
                className="underline text-[#787878]"
              >
                비회원 주문조회
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
