"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoadingScreen from "@/components/LoadingScreen";
import AddressModal from "@/components/modal/AddressModal";
import BannerSlider from "@/components/slider/BannerSlider";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import * as PortOne from "@portone/browser-sdk/v2";

const TOSS_PAYMENTS_CHANNEL_KEY =
  "channel-key-8f9a41df-ae97-4fbe-83b3-4d5f7b45944d";
const TOSS_PAY_CHANNEL_KEY = "channel-key-09171e01-eac9-43b2-bd82-4e830a5fe852";
const KAKAO_PAY_CHANNEL_KEY =
  "channel-key-ffacf44e-5508-446e-9b4c-d136cfe12478";

const enum payMethodEnum {
  EASY_PAY = "EASY_PAY",
  CARD = "CARD",
}

const enum channelEnum {
  TOSS_PAYMENTS = "TOSS_PAYMENTS",
  TOSS_PAY = "TOSS_PAY",
  KAKAO_PAY = "KAKAO_PAY",
}

function requestPayment(channel: channelEnum, payMethod: payMethodEnum) {
  PortOne.requestPayment({
    storeId: "store-f9c6de63-d746-420d-88c6-0a6815d4352b",
    paymentId: `payment-{${crypto.randomUUID()}`,
    orderName: "나이키 와플 트레이너 2 SD",
    totalAmount: 1000,
    currency: "CURRENCY_KRW",
    channelKey: channelKey,
    payMethod: payMethod,
  });
}


function generatePaymentId(channel: channelEnum) {
  switch (payMethod) {
    case payMethodEnum.CARD:
      return;
  }
}
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
  //배송메시지 리스트
  const [isActiveUl, setIsActiveUl] = useState<boolean>(false);
  //배송메시지 직접입력
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);

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

  const [isOpenAddressModal, setIsOpenAddressModal] = useState<boolean>(false);

  //우편번호
  const [zoneCode, setZoneCode] = useState<number | undefined>();
  const [address, setAddress] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);

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
        <div className="font-bold text-2xl p-6 border-b">주문고객</div>
        <div className="p-[1%] space-y-3 max-w-[50rem]">
          <div className="flex items-center">
            <label htmlFor="name" className="w-32  whitespace-nowrap">
              이름
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="주문하시는 분"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="w-32">
              이메일 주소
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="이메일 주소"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="w-32">
              휴대폰 번호
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="숫자만 입력하세요"
            />
          </div>
          <div className="text-[#787878] py-3">
            주문고객님의 정보로 주문정보(주문완료, 배송상태 등)를 안내해
            드립니다.
          </div>
        </div>
      </section>

      <section>
        <div className="font-bold text-2xl p-6 border-b">받는고객</div>
        <div className="p-[1%] space-y-3 max-w-[50rem]">
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 whitespace-nowrap">
              이름
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="받으시는 분"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="name" className="w-32">
              휴대폰 번호
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="숫자만 입력하세요"
            />
          </div>

          <div className="flex items-center flex-wrap gap-y-3">
            <label htmlFor="name" className="w-32 whitespace-nowrap">
              우편번호
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="우편번호"
              value={zoneCode ?? ""}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                setZoneCode(value == "" ? undefined : Number(value));
              }}
              disabled={isDisabled}
            />
            <button
              className="border p-3 ml-auto"
              onClick={() => {
                setIsOpenAddressModal(true);
              }}
            >
              우편번호 찾기
            </button>
          </div>

          <AddressModal
            isOpenAddressModal={isOpenAddressModal}
            setIsOpenAddressModal={setIsOpenAddressModal}
            setZoneCode={setZoneCode}
            setAddress={setAddress}
            setIsDisabled={setIsDisabled}
          />
          <div className="flex items-center flex-wrap gap-y-3">
            <label htmlFor="name" className="w-32 whitespace-nowrap">
              도로명주소
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="도로명주소"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div className="flex items-center flex-wrap gap-y-3">
            <label htmlFor="name" className="w-32 whitespace-nowrap">
              상세주소
            </label>
            <input
              type="text"
              className="border p-3 grow"
              placeholder="상세주소"
            />
          </div>

          <div className="flex items-center gap-y-3">
            <div className="w-32">배송 메시지 선택</div>
            {/* 정렬 리스트 */}
            <span className="flex flex-col bg-white grow">
              <button
                className="p-3 border text-left"
                onClick={() => setIsActiveUl(!isActiveUl)}
              >
                {isActiveInput ? "직접입력" : deliveryMessage}∨
              </button>

              {isActiveUl && (
                <ul className="border space-y-4 relative z-1  bg-white px-4 whitespace-nowrap">
                  {deliveryMessages.map((message, index) => (
                    <li key={`deliveryMessage${index}`}>
                      <button
                        onClick={() => {
                          setIsActiveUl(false);
                          setIsActiveInput(false);
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
                        setIsActiveUl(false);
                        setIsActiveInput(true);
                        setDeliveryMessage("직접입력");
                      }}
                    >
                      직접입력
                    </button>
                  </li>
                </ul>
              )}
            </span>

            {isActiveInput && (
              <input
                type="text"
                className="border p-3 grow"
                placeholder="베송메시지를 입력하세요"
                onChange={(event) => setDeliveryMessage(event.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="font-bold text-2xl p-6 border-b">결제수단</div>
        <div className="p-[1%] flex gap-x-2 flex-wrap">
          <button
            className="border p-3"
            onClick={() =>
              requestPayment(TOSS_PAYMENTS_CHANNEL_KEY, payMethodEnum.CARD)
            }
          >
            신용/체크카드
          </button>
          <button className="border p-3">네이버페이</button>
          <button
            className="border p-3"
            onClick={() =>
              requestPayment(KAKAO_PAY_CHANNEL_KEY, payMethodEnum.EASY_PAY)
            }
          >
            카카오페이
          </button>
          <button
            className="border p-3"
            onClick={() =>
              requestPayment(TOSS_PAY_CHANNEL_KEY, payMethodEnum.EASY_PAY)
            }
          >
            토스페이
          </button>
          <button className="border p-3">계좌이체</button>
          <button className="border p-3">휴대폰 결제</button>
        </div>
      </section>
    </article>
  );
};
