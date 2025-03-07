"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import LoginScreen from "@/components/LoginScreen";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import AddressModal from "@/components/modal/AddressModal";

export default () => {
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);

  const [addressName, setAddressName] = useState<string>("");
  const [receiverNickname, setReceiverNickname] = useState<string>("");
  const [receiverPhone, setReceiverPhone] = useState<string>("");
  //우편번호
  const [zoneCode, setZoneCode] = useState<number | undefined>();
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [isOpenAddressModal, setIsOpenAddressModal] = useState<boolean>(false);
  const addressNameRef = useRef<HTMLInputElement>(null);
  const receiverNicknameRef = useRef<HTMLInputElement>(null);
  const receiverPhoneRef = useRef<HTMLInputElement>(null);
  const zoneCodeRef = useRef<HTMLInputElement>(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const detailAddressRef = useRef<HTMLInputElement>(null);

  async function saveAddress() {
    if (authContext?.isLogined) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          //객체 단축 표기법
          body: JSON.stringify({
            addressName,
            receiverNickname,
            receiverPhone,
            zipCode: zoneCode,
            streetAddress,
            detailAddress,
          }),
        }
      );
      const simpleRes: SimpleResponseType = await res.json();
      simpleModalContext?.setMessage(simpleRes.message);
      simpleModalContext?.setIsOpenSimpleModal(true);
    }
  }

  return (
    <section>
      <div className="font-bold text-2xl p-[1%] border-b">받는고객</div>
      <div className="p-[2%] space-y-3 max-w-[50rem]">
        <div className="flex items-center">
          <label htmlFor="receiverNickname" className="w-32 whitespace-nowrap">
            배송지명
          </label>
          <input
            id="receiverNickname"
            type="text"
            className="border p-3 grow"
            placeholder="배송지명"
            value={addressName}
            onChange={(event) => setAddressName(event.target.value)}
            ref={addressNameRef}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="receiverNickname" className="w-32 whitespace-nowrap">
            이름
          </label>
          <input
            id="receiverNickname"
            type="text"
            className="border p-3 grow"
            placeholder="받으시는 분"
            value={receiverNickname}
            onChange={(event) => setReceiverNickname(event.target.value)}
            ref={receiverNicknameRef}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="receiverPhone" className="w-32">
            휴대폰 번호
          </label>
          <input
            id="receiverPhone"
            type="text"
            className="border p-3 grow"
            placeholder="숫자만 입력하세요"
            value={receiverPhone}
            onChange={(event) => setReceiverPhone(event.target.value)}
            ref={receiverPhoneRef}
          />
        </div>

        <div className="flex items-center flex-wrap gap-y-3">
          <label htmlFor="zoneCode" className="w-32 whitespace-nowrap">
            우편번호
          </label>
          <input
            id="zoneCode"
            type="text"
            className="border p-3 grow"
            placeholder="우편번호"
            value={zoneCode ?? ""}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
              setZoneCode(value == "" ? undefined : Number(value));
            }}
            disabled={isDisabled}
            ref={zoneCodeRef}
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
          setStreetAddress={setStreetAddress}
          setIsDisabled={setIsDisabled}
        />

        <div className="flex items-center flex-wrap gap-y-3">
          <label htmlFor="streetAddress" className="w-32 whitespace-nowrap">
            도로명주소
          </label>
          <input
            id="streetAddress"
            type="text"
            className="border p-3 grow"
            placeholder="도로명주소"
            value={streetAddress}
            onChange={(event) => setStreetAddress(event.target.value)}
            disabled={isDisabled}
            ref={streetAddressRef}
          />
        </div>

        <div className="flex items-center flex-wrap gap-y-3">
          <label htmlFor="detailAddress" className="w-32 whitespace-nowrap">
            상세주소
          </label>
          <input
            id="detailAddress"
            type="text"
            className="border p-3 grow"
            placeholder="상세주소"
            value={detailAddress}
            onChange={(event) => setDetailAddress(event.target.value)}
            ref={detailAddressRef}
          />
        </div>

        <button
          onClick={saveAddress}
          className="bg-black text-white p-3 border"
        >
          배송지 등록
        </button>
      </div>
    </section>
  );
};
