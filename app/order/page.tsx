"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import AddressModal from "@/components/modal/AddressModal";
import MemberAddressModal from "@/components/modal/MemberAddressModal";
import * as PortOne from "@portone/browser-sdk/v2";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

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
  const [isOpenMemberAddressModal, setIsOpenMemberAddressModal] =
    useState<boolean>(false);

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
  const [orderItems, setOrderItems] = useState<StorageItemDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [itemTotalPrice, setItemTotalPrice] = useState<number>(0);
  const shippingFee = itemTotalPrice >= 40000 ? 0 : 3000;

  const [orderMap, setOrderMap] = useState<Map<number, number>>(new Map());
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const [addressName, setAddressName] = useState<string>("");
  const [memberAddresses, setMemberAddresses] = useState<AddressResponse[]>([]);

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
  const router = useRouter();
  const searchParams = useSearchParams();

  //쇼핑백에서 구매하면 url 파라미터가 붙어서옴
  const inCart = searchParams.get("inCart");

  function check(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (index === 0)
      setIsChecked(Array(agreements.length).fill(event.target.checked));
    else {
      const newArr = [...isChecked];
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
    //유효성 검사
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

      // 이메일 형식 검증
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(senderEmail)) {
        senderEmailRef.current?.focus();
        simpleModalContext?.setMessage("유효한 이메일 주소를 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }

      if (!/^\d+$/.test(String(senderPhone))) {
        senderPhoneRef.current?.focus();
        simpleModalContext?.setMessage("주문자 전화번호를 입력해주세요");
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

    //1단계-PG사 결제
    const paymentId = `payment-${crypto.randomUUID()}`;
    const response = await PortOne.requestPayment({
      storeId: "store-f9c6de63-d746-420d-88c6-0a6815d4352b",
      paymentId: paymentId,
      orderName: orderName,
      totalAmount: itemTotalPrice,
      currency: "CURRENCY_KRW",
      channelKey: TOSS_PAYMENTS_CHANNEL_KEY,
      payMethod: payMethod,
      redirectUrl: `${process.env.NEXT_PUBLIC_ClIENT_URL}`,
      //oauth 계정은 휴대폰 번호가 없음
      customer: {
        fullName: senderNickname,
        ...(senderPhone && { phoneNumber: senderPhone }),
        email: senderEmail,
      },
    });

    if (response?.code !== undefined) {
      // 오류 발생
      alert(response.message);
      return;
    }

    //2단계-주문 API 호출
    const tamaOrder = localStorage.getItem("tamaOrder");
    let parsedTamaOrder;
    if (tamaOrder) parsedTamaOrder = JSON.parse(tamaOrder);

    const fetchUrl =
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/` +
      (authContext?.isLogined ? "member" : "guest");

    const token = localStorage.getItem("tamaAccessToken");

    const fetchHeader: Record<string, string> = {
      "Content-Type": "application/json",
      ...(authContext?.isLogined &&
        token && { Authorization: `Bearer ${token}` }),
    };

    //객체 단축 표기법
    const fetchBody: Record<string | number, string | number | undefined> = {
      paymentId,
      receiverNickname,
      receiverPhone,
      zipCode: zoneCode,
      streetAddress,
      detailAddress,
      deliveryMessage,
      orderItems: parsedTamaOrder,
      ...(!authContext?.isLogined && {
        senderNickname,
        senderPhone,
        senderEmail,
      }),
    };

    //FETCH 한 후에 표시하는게 더 적절하지만, 그렇게하면 모달이 안뜨네요
    simpleModalContext?.setMessage("결제 진행 중.. 나가지 마세요");
    simpleModalContext?.setIsOpenSimpleModal(true);

    const notified = await fetch(fetchUrl, {
      method: "POST",
      headers: fetchHeader,
      // paymentId와 주문 정보를 서버에 전달합니다
      body: JSON.stringify(fetchBody),
    });

    const notifiedJson: SimpleResponseType = await notified.json();
    simpleModalContext?.setMessage(notifiedJson.message);

    if (notified.ok) {
      const stringCart = localStorage.getItem("tamaCart");
      const stringOrder = localStorage.getItem("tamaOrder");

      //order한거 cart에서 지움 (바로구매 or 일괄구매)
      if (inCart && stringCart && stringOrder) {
        const parsedCart: StorageItemType[] = JSON.parse(stringCart);
        const parsedOrder: StorageItemType[] = JSON.parse(stringOrder);
        const orderSizeStockIds = parsedOrder.map(
          (item) => item.colorItemSizeStockId
        );
        //order한거 지운 cart.
        const updatedCart = parsedCart.filter(
          (cart) => !orderSizeStockIds.includes(cart.colorItemSizeStockId)
        );
        localStorage.setItem("tamaCart", JSON.stringify(updatedCart));
      }

      localStorage.removeItem("tamaOrder");

      if (authContext?.isLogined) router.push("/myPage/order");
      else router.push("/guest");

      return;
    }
  }

  //fetchOrderItem(), syncOrderMap(),
  useEffect(() => {
    async function fetchOrderItem() {
      const jsonStrOrder = localStorage.getItem("tamaOrder");
      const parsedOrder: StorageItemType[] = jsonStrOrder
        ? JSON.parse(jsonStrOrder)
        : null;

      if (!parsedOrder || parsedOrder.length === 0) {
        simpleModalContext?.setMessage("주문할 상품이 없습니다");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }

      const itemStocks: number[] = [];
      parsedOrder?.forEach((item) => {
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

    //주문 가격 계산시 필요.
    function syncOrderMap() {
      const stringOrder = localStorage.getItem("tamaOrder");
      const parsedOrder: StorageItemType[] =
        stringOrder && JSON.parse(stringOrder);
      const newOrderMap = new Map();
      parsedOrder?.forEach((orderItem) => {
        newOrderMap?.set(orderItem.colorItemSizeStockId, orderItem.orderCount);
      });
      setOrderMap(newOrderMap);
    }
    syncOrderMap();

    setIsLoading(false);
  }, []);

  //전역 객체 할당 딜레이 때문에 필요
  useEffect(() => {
    async function fetchMember() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/order-setup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
        }
      );

      if (res.ok) {
        const member: MemberOrderSetUpType = await res.json();
        setMemberAddresses(member.addresses);
        //포트원 결제 기록 첨부(주문한 사람 자동으로 기입)
        setSenderNickname(member.nickname);
        setSenderPhone(member.phone);
        setSenderEmail(member.email);

        const defaultAddress: AddressResponse | undefined =
          member.addresses.find((address) => address.isDefault == true);

        if (defaultAddress) {
          setHasAddress(true);
          setReceiverNickname(defaultAddress.receiverNickname);
          setReceiverPhone(defaultAddress.receiverPhone);
          setZoneCode(Number(defaultAddress.zipCode));
          setStreetAddress(defaultAddress.street);
          setDetailAddress(defaultAddress.detail);
          setAddressName(defaultAddress.name);
        }
      }
    }
    if (authContext?.isLogined) fetchMember();
  }, [authContext?.isLogined]);

  useEffect(() => {
    setItemTotalPrice(
      orderItems.reduce(
        (total, orderItem) =>
          total +
          (orderItem.discountedPrice ?? orderItem.price) *
            (orderMap.get(orderItem.sizeStock.id) ?? 0),
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

      {!authContext?.isLogined && !isAgreed ? (
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
      ) : (
        <>
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
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                      setSenderPhone(value);
                    }}
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

          {authContext?.isLogined && hasAddress ? (
            <section>
              <div className="font-bold text-2xl p-[1%] border-b">배송지</div>
              <div className="p-[2%] space-y-3 max-w-[50rem]">
                <div className="flex items-center gap-x-3">
                  <div>{receiverNickname}</div>
                  <div>{addressName}</div>
                  <button
                    onClick={() => setIsOpenMemberAddressModal(true)}
                    className="border p-3"
                  >
                    변경
                  </button>
                  <MemberAddressModal
                    addresses={memberAddresses}
                    setAddressName={setAddressName}
                    setStreetAddress={setStreetAddress}
                    setDetailAddress={setDetailAddress}
                    setZoneCode={setZoneCode}
                    setReceiverNickname={setReceiverNickname}
                    setReceiverPhone={setReceiverPhone}
                    setIsOpenMemberAddressModal={setIsOpenMemberAddressModal}
                    isOpenMemberAddresskModal={isOpenMemberAddressModal}
                    setHasAddress={setHasAddress}
                  />
                </div>
                <div className="flex gap-x-1">
                  <div>{streetAddress}</div>
                  <div>{detailAddress}</div>
                  <div>({zoneCode})</div>
                </div>
                {receiverPhone}

                <div className="relative flex items-center flex-wrap gap-y-3">
                  <label className=" w-32 whitespace-nowrap">
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
                      <div className="border space-y-4 absolute z-1 bg-white px-3 whitespace-nowrap w-full">
                        <ul className="space-y-5 my-3">
                          {deliveryMessages.map((message, index) => (
                            <li
                              key={`deliveryMessage${index}`}
                              className="w-full"
                            >
                              <button
                                className="w-full text-left"
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
                          <li className="w-full">
                            <button
                              className="w-full text-left"
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
                      </div>
                    )}
                  </span>

                  {isActiveSelfInput && (
                    <input
                      id="deliveryMessage"
                      type="text"
                      className="border p-3 grow"
                      placeholder="베송메시지를 입력하세요"
                      onChange={(event) =>
                        setDeliveryMessage(event.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            </section>
          ) : (
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
                    onChange={(event) =>
                      setReceiverNickname(event.target.value)
                    }
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
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                      setReceiverPhone(value);
                    }}
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
                  <label
                    htmlFor="streetAddress"
                    className="w-32 whitespace-nowrap"
                  >
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
                  <label
                    htmlFor="detailAddress"
                    className="w-32 whitespace-nowrap"
                  >
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

                <div className="flex items-center flex-wrap gap-y-3">
                  <label htmlFor="" className="w-32 whitespace-nowrap">
                    배송 메시지 선택
                  </label>
                  {/* 정렬 리스트 */}
                  <span className="relative flex flex-col bg-white grow ">
                    <button
                      className="p-3 border text-left"
                      onClick={() => setIsActiveUl(!isActiveUl)}
                    >
                      {isActiveSelfInput ? "직접입력" : deliveryMessage}∨
                    </button>

                    {isActiveUl && (
                      <ul className="border space-y-4 z-1 absolute w-full bg-white p-3 whitespace-nowrap ">
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
                      onChange={(event) =>
                        setDeliveryMessage(event.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            </section>
          )}

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
                    src={`${process.env.NEXT_PUBLIC_S3_URL}/${item.uploadFile.storedFileName}`}
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
                      <div>{orderMap.get(item.sizeStock.id)}개 주문</div>
                    </div>
                    <div className="text-sm text-[#aaa]">
                      {item.discountedPrice &&
                        `${(
                          item.price * orderMap.get(item.sizeStock.id)!
                        ).toLocaleString("ko-kr")}원`}
                    </div>
                    <div className="text-2xl font-semibold">
                      {item.discountedPrice
                        ? `${(
                            item.discountedPrice *
                            orderMap.get(item.sizeStock.id)!
                          ).toLocaleString("ko-kr")}원`
                        : `${(
                            item.price * orderMap.get(item.sizeStock.id)!
                          ).toLocaleString("ko-kr")}원`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {!isLoading && orderItems.length != 0 && (
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
        </>
      )}
    </article>
  );
};
