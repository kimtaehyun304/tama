"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoadingScreen from "@/components/LoadingScreen";
import BannerSlider from "@/components/slider/BannerSlider";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";

export default () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authContext = useContext(AuthContext);
  const agreements = [
    "모두 동의",
    "비회원구매 개인정보 수집 및 이용동의",
    "만 14세 이상입니다",
  ];
  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(agreements.length).fill(false)
  );
  const simpleModalContext = useContext(SimpleModalContext);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isDisplay, setIsDisplay] = useState<boolean>(false);

  const deliveryMessages = [
    "배송 전에 미리 연락 바랍니다.",
    "부재 시 경비실에 맡겨 주세요.",
    "부재 시 문 앞에 놓아주세요.",
    "부재 시 전화나 문자 주세요.",
    "택배함에 넣어주세요.",
  ];

  const [deliveryMessage, setDeliveryMessage] = useState<string>(
    deliveryMessages[0]
  );

  function check(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (index === 0)
      setIsChecked(Array(agreements.length).fill(event.target.checked));
    else {
      let newArr = [...isChecked];
      newArr[index] = event.target.checked;
      setIsChecked(newArr);
    }
  }

  function validateAgreement() {
    if (isChecked.slice(1).some((value) => value === false)) {
      simpleModalContext?.setMessage("약관에 동의해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
    } else setIsAgreed(true);
  }

  return (
    <article className="xl:mx-standard">
      <div className="text-center font-bold text-3xl py-9 border-b-2 border-black">
        주문서
      </div>
      <div className="text-center bg-[#f8f8f8] py-6">
        <span className="font-semibold underline">로그인</span>하시면, 더 많은
        혜택을 받으실 수 있습니다.
      </div>

      {/*
      {!authContext?.isLogined && !isAgreed && (
        <section>
          <div className="text-center font-bold text-3xl py-9">
            비회원 주문 약관동의
          </div>
          <div className="flex justify-center">
            <div className="divide-y-2">
              {agreements.map((agreement, index) => (
                <div className="flex py-3" key={`agreement${index}`}>
                  <input
                    type="checkbox"
                    className="w-7 h-7 accent-black"
                    id={`checkbox${index}`}
                    checked={isChecked[index]}
                    onChange={(event) => {
                      check(event, index);
                    }}
                  />
                  <label htmlFor={`checkbox${index}`} className="pl-2 text-xl">
                    {agreement}
                  </label>
                </div>
              ))}
              <button
                className="border p-3 w-full bg-black text-white"
                onClick={validateAgreement}
              >
                약관동의
              </button>
            </div>
          </div>
        </section>
      )}
              {isAgreed || isAgreed && (

      )}

 */}
      <section>
        <div className="font-bold text-2xl p-6 border-b-2">주문고객</div>
        <div className="p-[1%]">
          <div className="space-y-3  inline-block">
            <div className="flex items-center ">
              <label htmlFor="name" className="w-36  whitespace-nowrap">
                이름
              </label>
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="주문하시는 분"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="w-36">
                이메일 주소
              </label>
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="이메일 주소"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="w-36">
                휴대폰 번호
              </label>
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="숫자만 입력하세요"
              />
            </div>
          </div>
          <div className="text-[#787878] py-3">
            주문고객님의 정보로 주문정보(주문완료, 배송상태 등)를 안내해
            드립니다.
          </div>
        </div>
      </section>

      <section>
        <div className="font-bold text-2xl p-6 border-b-2">받는고객</div>
        <div className="p-[1%]">
          <div className="space-y-3 inline-block">
            <div className="flex items-center">
              <label htmlFor="name" className="w-36 whitespace-nowrap">
                이름
              </label>
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="받으시는 분"
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="name" className="w-36">
                휴대폰 번호
              </label>
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="숫자만 입력하세요"
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="name" className="w-36 whitespace-nowrap">
                배송지
              </label>
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="우편번호"
              />
              <button className="border p-3 ml-3">우편번호 찾기</button>
            </div>

            <div className="flex items-center">
              <label htmlFor="name" className="w-36 whitespace-nowrap">
                주소
              </label>
              <input
                type="text"
                className="border p-3 w-64 mr-3"
                placeholder="도로명주소"
              />
              <input
                type="text"
                className="border p-3 w-64"
                placeholder="상세주소"
              />
            </div>

            <div className="flex items-center">
              <div className="w-36">배송 메시지 선택</div>
              {/* 정렬 리스트 */}
              <span className="inline-flex flex-col relative bg-white w-64">
                <button
                  className="p-3 border text-left"
                  onClick={() => setIsDisplay(!isDisplay)}
                >
                  {deliveryMessage}∨
                </button>

                {isDisplay && (
                  <ul className="border space-y-4 absolute z-1 top-full bg-white px-4 whitespace-nowrap w-64">
                    {deliveryMessages.map((message, index) => (
                      <li key={`deliveryMessage${index}`}>
                        <button
                          onClick={() => {
                            setIsDisplay(false);
                            setDeliveryMessage(message);
                          }}
                        >
                          {message}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => {
                          setIsDisplay(false);
                          setDeliveryMessage("직접입력");
                        }}
                      >
                        직접입력
                      </button>
                    </li>
                  </ul>
                )}
              </span>
              {deliveryMessage === "직접입력" && (
                <input
                  type="text"
                  className="border p-3 w-64 ml-3"
                  placeholder="베송메시지를 입력하세요"
                  onChange={(event)=>setDeliveryMessage(event.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
