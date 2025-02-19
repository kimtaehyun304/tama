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
import { useState, useEffect, useContext, useRef } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { LoginModalContext } from "@/components/context/LoginModalContext";

const enum payMethodEnum {
  EASY_PAY = "EASY_PAY",
  CARD = "CARD",
  //휴대폰 소액결제
  MOBILE = "MOBILE",
  //실시간 계좌이체
  TRANSFER = "TRANSFER",
}

const payMethodLabel = [
  { type: payMethodEnum.CARD, label: "신용/체크카드" },
  { type: payMethodEnum.TRANSFER, label: "계좌이체" },
  //{ type: payMethodEnum.MOBILE, label: "휴대폰 결제" },
];

/*
const enum channelEnum {
  TOSS_PAYMENTS = "TOSS_PAYMENTS",
  TOSS_PAY = "TOSS_PAY",
  KAKAO_PAY = "KAKAO_PAY",
  KPN = "KPN",
}

function generatePaymentId(channel: channelEnum) {
  switch (channel) {
    case channelEnum.TOSS_PAYMENTS:
      return `payment-${crypto.randomUUID()}`;
    case channelEnum.TOSS_PAY:
      return `payment${Math.random().toString(36).slice(2)}`;
    case channelEnum.KPN:
      return `payment${Math.random().toString(36).slice(2)}`;
    case channelEnum.KAKAO_PAY:
      return `payment-${crypto.randomUUID()}`;
  }
}

function getChannelKey(channel: channelEnum) {
  switch (channel) {
    case channelEnum.TOSS_PAYMENTS:
      return "channel-key-8f9a41df-ae97-4fbe-83b3-4d5f7b45944d";
    case channelEnum.TOSS_PAY:
      return "channel-key-09171e01-eac9-43b2-bd82-4e830a5fe852";
    case channelEnum.KAKAO_PAY:
      return "channel-key-ffacf44e-5508-446e-9b4c-d136cfe12478";
  }
}
*/

const agreements = [
  "모두 동의",
  "비회원구매 개인정보 수집 및 이용동의",
  "만 14세 이상입니다",
];

const deliveryMessages = [
  "배송 전에 미리 연락 바랍니다.",
  "부재 시 경비실에 맡겨 주세요.",
  "부재 시 문 앞에 놓아주세요.",
  "부재 시 전화나 문자 주세요.",
  "택배함에 넣어주세요.",
];

const TOSS_PAYMENTS_CHANNEL_KEY =
  "channel-key-8f9a41df-ae97-4fbe-83b3-4d5f7b45944d";

export default () => {
  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(agreements.length).fill(false)
  );
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const loginModalContext = useContext(LoginModalContext);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  //배송메시지 리스트
  const [isActiveUl, setIsActiveUl] = useState<boolean>(false);
  //배송메시지 직접입력
  const [isActiveSelfInput, setIsActiveSelfInput] = useState<boolean>(false);

  const [deliveryMessage, setDeliveryMessage] = useState<string>(
    deliveryMessages[0]
  );

  const [isOpenAddressModal, setIsOpenAddressModal] = useState<boolean>(false);

  const [senderNickname, setSenderNickname] = useState<string>("");
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [senderPhone, setSenderPhone] = useState<string>("");

  const [receiverNickname, setReceiverNickname] = useState<string>("");
  const [receiverPhone, setReceiverPhone] = useState<string>("");

  //우편번호
  const [zoneCode, setZoneCode] = useState<number | undefined>();
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [selectedPayMethod, setSelectedPayMethod] = useState<payMethodEnum>(
    payMethodEnum.CARD
  );
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [itemTotalPrice, setItemTotalPrice] = useState<number>(0);
  const shippingFee = itemTotalPrice >= 40000 ? 0 : 3000;

  const [cartMap, setCartMap] = useState<Map<number, number>>(new Map());

  //focus 용도
  const senderNicknameRef = useRef<HTMLInputElement>(null);
  const senderEmailRef = useRef<HTMLInputElement>(null);
  const senderPhoneRef = useRef<HTMLInputElement>(null);

  const receiverNicknameRef = useRef<HTMLInputElement>(null);
  const receiverPhoneRef = useRef<HTMLInputElement>(null);
  const zoneCodeRef = useRef<HTMLInputElement>(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const detailAddressRef = useRef<HTMLInputElement>(null);
  const deliveryMessageRef = useRef<HTMLInputElement>(null);

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

  async function requestPayment(
    payMethod: payMethodEnum,
    itemTotalPrice: number,
    orderName: string
  ) {
    if (!authContext?.isLogined) {
      if (!senderNickname) {
        senderNicknameRef.current?.focus();
        simpleModalContext?.setMessage("이름을 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }

      if (!senderEmail) {
        senderEmailRef.current?.focus();
        simpleModalContext?.setMessage("이메일을 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }

      if (!/^\d+$/.test(String(senderPhone))) {
        senderPhoneRef.current?.focus();
        simpleModalContext?.setMessage("전화번호를 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }
    }
    if (!receiverNickname) {
      receiverNicknameRef.current?.focus();
      simpleModalContext?.setMessage("수령인 이름을 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (!/^\d+$/.test(String(receiverPhone))) {
      receiverPhoneRef.current?.focus();
      simpleModalContext?.setMessage("수령인 전화번호를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (!/^\d+$/.test(String(zoneCode))) {
      zoneCodeRef.current?.focus();
      simpleModalContext?.setMessage("우편번호를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (!streetAddress) {
      streetAddressRef.current?.focus();
      simpleModalContext?.setMessage("도로명 주소를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (!detailAddress) {
      detailAddressRef.current?.focus();
      simpleModalContext?.setMessage("상세 주소를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (!deliveryMessage) {
      deliveryMessageRef.current?.focus();
      simpleModalContext?.setMessage("배송 메시지를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    const paymentId = `payment-${crypto.randomUUID()}`;
    const response = await PortOne.requestPayment({
      storeId: "store-f9c6de63-d746-420d-88c6-0a6815d4352b",
      paymentId: paymentId,
      orderName: orderName,
      totalAmount: itemTotalPrice,
      currency: "CURRENCY_KRW",
      channelKey: TOSS_PAYMENTS_CHANNEL_KEY,
      payMethod: payMethod,
    });

    if (response?.code !== undefined) {
      // 오류 발생
      return alert(response.message);
    }

    const tamaOrder = localStorage.getItem("tamaOrder");
    let parsedTamaOrder;
    if (tamaOrder) parsedTamaOrder = JSON.parse(tamaOrder);

    // /payment/complete 엔드포인트를 구현해야 합니다. 다음 목차에서 설명합니다.
    const notified = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
        },
        // paymentId와 주문 정보를 서버에 전달합니다
        body: JSON.stringify({
          paymentId: paymentId,
          receiverNickname: receiverNickname,
          receiverPhone: receiverPhone,
          zipCode: zoneCode,
          streetAddress: streetAddress,
          detailAddress: detailAddress,
          deliveryMessage: deliveryMessage,
          orderItems: parsedTamaOrder,
        }),
      }
    );

    const notifiedJson: SimpleResponseType = await notified.json();
    alert(notifiedJson.message);
  }

  useEffect(() => {
    async function fetchOrderItem() {
      const jsonStrCart = localStorage.getItem("tamaOrder");
      const parsedOrder = jsonStrCart ? JSON.parse(jsonStrCart) : null;

      if (!jsonStrCart || parsedOrder.length === 0) {
        simpleModalContext?.setMessage("주문할 상품이 없습니다");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }

      const parsedCart: StorageItemType[] = JSON.parse(jsonStrCart);
      let itemStocks: number[] = [];
      parsedCart?.forEach((item) => {
        itemStocks.push(item.colorItemSizeStockId);
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/colorItemSizeStock?id=${itemStocks.join()}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json(); // 에러 응답을 따로 파싱
        alert(errorResponse.message);
        return;
      }

      const orderItemsJson: StorageItemDetailType[] = await res.json(); // 정상 데이터 처리
      setOrderItems(orderItemsJson);
    }
    fetchOrderItem();
    //로컬스토리지와 동기화
    function syncCartMap() {
      const stringCart = localStorage.getItem("tamaOrder");
      const parsedCart: StorageItemType[] =
        stringCart && JSON.parse(stringCart);
      const newCartMap = new Map();
      parsedCart?.forEach((cartItem) => {
        newCartMap?.set(cartItem.colorItemSizeStockId, cartItem.orderCount);
      });
      setCartMap(newCartMap);
    }
    syncCartMap();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setItemTotalPrice(
      orderItems.reduce(
        (total, orderItem) =>
          total +
          (orderItem.discountedPrice ?? orderItem.price) *
            (cartMap.get(orderItem.sizeStock.id) ?? 0),
        0
      )
    );
  }, [orderItems]);

  return (
    <article className="xl:mx-standard">
      <div className="text-center font-bold text-3xl py-9 border-b-2 border-black">
        주문서
      </div>
      {!authContext?.isLogined && (
        <div className="text-center bg-[#f8f8f8] py-6">
          <span
            className="font-semibold underline cursor-pointer"
            onClick={() => loginModalContext?.setIsOpenLoginModal(true)}
          >
            로그인
          </span>
          하시면, 더 많은 혜택을 받으실 수 있습니다.
        </div>
      )}
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

      {/*주문고객 */}
      {/*로그인 유저 ORDER 함수는 sender state 사용X.  */}
      {!authContext?.isLogined && (
        <section>
          <div className="font-bold text-2xl p-[1%] border-b">주문고객</div>
          <div className="p-[2%] space-y-3 max-w-[50rem]">
            <div className="flex items-center">
              <label
                htmlFor="senderNickname"
                className="w-32  whitespace-nowrap"
              >
                이름
              </label>
              <input
                id="senderNickname"
                type="text"
                className="border p-3 grow"
                placeholder="주문하시는 분"
                value={senderNickname}
                onChange={(event) => setSenderNickname(event.target.value)}
                ref={senderNicknameRef}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="senderEmail" className="w-32">
                이메일 주소
              </label>
              <input
                id="senderEmail"
                type="text"
                className="border p-3 grow"
                placeholder="이메일 주소"
                value={senderEmail}
                onChange={(event) => setSenderEmail(event.target.value)}
                ref={senderEmailRef}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="senderPhone" className="w-32">
                휴대폰 번호
              </label>
              <input
                id="senderPhone"
                type="text"
                className="border p-3 grow"
                placeholder="숫자만 입력하세요"
                value={senderPhone}
                onChange={(event) => setSenderPhone(event.target.value)}
                ref={senderPhoneRef}
              />
            </div>
            <div className="text-[#787878] py-3">
              주문고객님의 정보로 주문정보(주문완료, 배송상태 등)를 안내해
              드립니다.
            </div>
          </div>
        </section>
      )}

      {/*받는고객 */}
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">받는고객</div>
        <div className="p-[2%] space-y-3 max-w-[50rem]">
          <div className="flex items-center">
            <label
              htmlFor="receiverNickname"
              className="w-32 whitespace-nowrap"
            >
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

          <div className="flex items-center gap-y-3">
            <label htmlFor="" className="w-32 whitespace-nowrap">
              배송 메시지 선택
            </label>
            {/* 정렬 리스트 */}
            <span className="flex flex-col bg-white grow">
              <button
                className="p-3 border text-left"
                onClick={() => setIsActiveUl(!isActiveUl)}
              >
                {isActiveSelfInput ? "직접입력" : deliveryMessage}∨
              </button>

              {isActiveUl && (
                <ul className="border space-y-4 relative z-1  bg-white px-4 whitespace-nowrap">
                  {deliveryMessages.map((message, index) => (
                    <li key={`deliveryMessage${index}`}>
                      <button
                        onClick={() => {
                          setIsActiveUl(false);
                          setIsActiveSelfInput(false);
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
                        setIsActiveSelfInput(true);
                        setDeliveryMessage("");
                      }}
                    >
                      직접입력
                    </button>
                  </li>
                </ul>
              )}
            </span>

            {isActiveSelfInput && (
              <input
                id="deliveryMessage"
                type="text"
                className="border p-3 grow"
                placeholder="베송메시지를 입력하세요"
                onChange={(event) => setDeliveryMessage(event.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/*결제수단 */}
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">결제수단</div>
        <div className="p-[2%] flex gap-x-2 flex-wrap">
          {payMethodLabel.map(({ type, label }) => {
            const isSelected = selectedPayMethod === type;
            return (
              <button
                key={type}
                className={`border p-3 rounded-md ${
                  isSelected
                    ? "bg-gray-100 text-black border-black"
                    : "bg-white"
                }`}
                onClick={() => setSelectedPayMethod(type)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/*주문상품 */}
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">주문상품</div>
        <div className="p-[2%] flex flex-col xl:grid xl:grid-cols-2 gap-3">
          {orderItems.map((item, index) => (
            <div className="border flex gap-x-4 p-2" key={`item-${index}`}>
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
              />
              <div className="flex flex-col gap-y-2 flex-1">
                <div>
                  <div>{item.name}</div>
                  <div>
                    {item.color}/{item.sizeStock.size}
                  </div>
                  <div>{cartMap.get(item.sizeStock.id)}개 주문</div>
                </div>
                <div className="text-sm text-[#aaa]">
                  {item.discountedPrice &&
                    `${item.price.toLocaleString("ko-KR")}원`}
                </div>
                <div className="text-2xl font-semibold">
                  {item.discountedPrice
                    ? item.discountedPrice.toLocaleString("ko-KR")
                    : item.price.toLocaleString("ko-KR")}
                  원
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {!isLoading && (
        <>
          {/*주문가격 및 결제하기*/}
          <section className="text-center m-4">
            <div className="bg-[#f5f5f5] inline-block p-4 space-y-3">
              <div className="flex justify-center gap-x-20">
                <span className="grow">상품금액</span>
                <span className="grow">
                  {itemTotalPrice.toLocaleString("ko-KR")}원
                </span>
              </div>
              <div className="flex justify-center">
                <span className="">배송비</span>
                <span className="grow text-right">
                  {shippingFee.toLocaleString("ko-KR")}원
                </span>
              </div>
              <hr />
              <div className="flex font-semibold text-xl">
                <span>총</span>
                <span className="grow text-right">
                  {(itemTotalPrice + shippingFee).toLocaleString("ko-KR")}
                </span>
                원
              </div>
              <div>
                <button
                  className="bg-[#131922] text-[#fff] border p-4 w-full"
                  onClick={() =>
                    requestPayment(
                      selectedPayMethod,
                      itemTotalPrice,
                      orderItems.length === 1
                        ? orderItems[0].name
                        : orderItems[0].name + " 등 " + orderItems.length
                    )
                  }
                >
                  결제하기
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </article>
  );
};
