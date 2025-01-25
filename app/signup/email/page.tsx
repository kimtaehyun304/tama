"use client";

import { LoginModalContext } from "@/components/context/LoginModalContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoadingScreen from "@/components/LoadingScreen";
import BannerSlider from "@/components/slider/BannerSlider";
import { error } from "console";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext, useRef } from "react";

export default function SignUpEmail() {
  const agreements = ["모두 동의", "이용약관", "개인정보 수집 및 이용동의"];
  const [emailUsername, setEmailUsername] = useState<string>("");
  const [emailDomain, setEmailDomain] = useState<string>("");
  const [authString, setAuthString] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");

  const [isDisabled, setIsDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(agreements.length).fill(false)
  );

  const emailUsernameRef = useRef<HTMLInputElement>(null);
  const emailDomainRef = useRef<HTMLInputElement>(null);
  const authStringRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pw2Ref = useRef<HTMLInputElement>(null);

  const simpleModalContext = useContext(SimpleModalContext);
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리

  // 폼 검증 or 안내 메시지
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [sendMessage, setSendMessage] = useState<string>("");
  const [authMessage, setAuthMessage] = useState<string>("");
  const [pwMessage, setPwMessage] = useState<string>("");
  const [agreementMessage, setAgreementMessage] = useState<string>("");

  function check(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (index === 0)
      setIsChecked(Array(agreements.length).fill(event.target.checked));
    else {
      let newArr = [...isChecked];
      newArr[index] = event.target.checked;
      setIsChecked(newArr);
    }
  }

  async function sendAuthenticationEmail(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (!emailUsername) {
      emailUsernameRef.current?.focus();
      setEmailMessage("아이디를 입력해주세요");
      return;
    }

    if (!emailDomain) {
      emailDomainRef.current?.focus();
      setEmailMessage("도메인을 입력해주세요");
      return;
    }

    //setEmailMessage("");

    const button = event.target as HTMLButtonElement;
    button.disabled = true;
    setSendMessage("발송 중");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: `${emailUsername}@${emailDomain}` }),
        }
      );

      const simpleRes: SimpleResponseType = await response.json();
      setSendMessage(simpleRes.message);
    } catch (error) {
      alert(error);
    }

    button.disabled = false;
  }

  async function signUp(event: React.MouseEvent<HTMLButtonElement>) {
    if (!emailUsername) {
      emailUsernameRef.current?.focus();
      setEmailMessage("아이디를 입력해주세요");
      return;
    }

    if (!emailDomain) {
      emailDomainRef.current?.focus();
      setEmailMessage("도메인을 입력해주세요");
      return;
    }

    if (!authString) {
      authStringRef.current?.focus();
      setAuthMessage("인증 문자를 입력해주세요");
      return;
    }

    if (!pw) {
      pwRef.current?.focus();
      setPwMessage("비밀번호를 입력해주세요");
      return;
    }

    if (!pw2) {
      pw2Ref.current?.focus();
      setPwMessage("비밀번호 확인을 입력해주세요");
      return;
    }

    if (!pw) {
      pwRef.current?.focus();
      setPwMessage("비밀번호를 입력해주세요");
      return;
    }

    if (pw !== pw2) {
      setPwMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;
    if (!regex.test(pw)) {
      setPwMessage("비밀번호는 숫자와 영문을 포함하여 10자 이상으로 해주세요");
      return;
    }

    if (isChecked.slice(1).some((value) => value === false)) {
      setAgreementMessage("약관에 동의해주세요");
      return;
    }

    const button = event.target as HTMLButtonElement;
    button.disabled = true;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: `${emailUsername}@${emailDomain}`,
            authString: authString,
            password: pw,
          }),
        }
      );
      const simpleRes: SimpleResponseType = await response.json();

      if (response.status === 201) {
        alert(simpleRes.message)
        loginModalContext?.setIsOpenLoginModal(true)
      }
    } catch (error) {
      alert(error);
    }

    button.disabled = false;
  }

  return (
    <article className="bg-[#f0f0f0] py-3">
      <section className="xl:mx-[20%] py-1 bg-white border-4 ">
        <div className="text-center space-y-3 py-4">
          <div className="text-4xl">이메일로 가입하기</div>
          <div className="flex justify-center flex-wrap">
            <input
              type="text"
              className="border p-3 flex-shrink min-w-0 focus:outline-none"
              onChange={(event) => {
                setEmailUsername(event.target.value);
              }}
              ref={emailUsernameRef}
              placeholder="아이디"
            />
            <div className="self-center">@</div>
            <input
              type="text"
              className="border p-3 flex-shrink min-w-0 focus:outline-none"
              value={emailDomain}
              onChange={(event) => {
                setEmailDomain(event.target.value);
                setEmailMessage("");
              }}
              ref={emailDomainRef}
              placeholder="도메인"
              disabled={isDisabled}
            />
            <select
              name=""
              id=""
              className="border p-3"
              onChange={(event) => {
                setEmailDomain(event.target.value);
                setEmailMessage("");
                setIsDisabled(event.target.value !== "");
              }}
            >
              <option value="">직접입력</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
            </select>
            <button
              className="border p-3 shrink min-w-0 bg-black text-white"
              onClick={(event) => sendAuthenticationEmail(event)}
            >
              인증메일 발송
            </button>
          </div>
          <div className="text-red-600">{emailMessage}</div>
          <div className="text-red-600">{sendMessage}</div>
          <div>
            <input
              type="text"
              className="border p-3 focus:outline-none"
              placeholder="인증 문자"
              onChange={(event) => {
                setAuthString(event.target.value);
                setAuthMessage("");
              }}
            />
            <div className="text-red-600">{authMessage}</div>
            {/*
            <button className="border p-3 shrink min-w-0 bg-black text-white">
              인증
            </button>
            */}
          </div>

          <div>
            <input
              type="password"
              className="border p-3 focus:outline-none"
              placeholder="비밀번호"
              ref={pwRef}
              onChange={(event) => {
                setPw(event.target.value);
                setPwMessage("");
              }}
            />
          </div>
          <div>숫자, 영문 포함 10자 이상</div>
          <div>
            <input
              type="password"
              className="border p-3 focus:outline-none"
              placeholder="비밀번호 확인"
              ref={pw2Ref}
              onChange={(event) => {
                setPw2(event.target.value);
                setPwMessage("");
              }}
            />
          </div>
          <div className="text-red-600">{pwMessage}</div>
        </div>
        <div className="flex justify-center text-xl">
          <div>
            <div className="font-bold text-2xl">이용약관</div>
            <div className="divide-y-2 space-y-1">
              {agreements.map((agreement, index) => (
                <div className="p-1" key={`agreement${index}`}>
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    id={`checkbox${index}`}
                    checked={isChecked[index]}
                    onChange={(event) => {
                      check(event, index);
                    }}
                  />
                  <label htmlFor={`checkbox${index}`} className="pl-2">
                    {agreement}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-red-600 text-center">{agreementMessage}</div>
            <button
              className="border p-3 w-full bg-black text-white"
              onClick={signUp}
            >
              약관동의 및 가입완료
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}
