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
import Agreements from "./Agreements";
import OrderForm from "./OrderForm";
import { useForm } from "react-hook-form";

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
  const { register: senderFormRegister } = useForm<SenderFormState>({
    defaultValues: {
      senderNickname: "",
      senderEmail: "",
    },
  });

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

  //const [senderNickname, setSenderNickname] = useState<string>("");
  //const [senderEmail, setSenderEmail] = useState<string>("");
  //const [senderPhone, setSenderPhone] = useState<string>("");

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
  
  const [addressName, setAddressName] = useState<string>("");
  const [memberAddresses, setMemberAddresses] = useState<AddressResponse[]>([]);

  //focus 용도
  const senderNicknameRef = useRef<HTMLInputElement>(null);
  const senderEmailRef = useRef<HTMLInputElement>(null);
  //const senderPhoneRef = useRef<HTMLInputElement>(null);
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
      /*
      if (!/^\d+$/.test(String(senderPhone))) {
        senderPhoneRef.current?.focus();
        simpleModalContext?.setMessage("주문자 전화번호를 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }
        */
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
    //2단계-주문 API 호출
    const tamaOrder = localStorage.getItem("tamaOrder");
    let parsedTamaOrder: StorageItemType[] = [];
    if (tamaOrder) parsedTamaOrder = JSON.parse(tamaOrder);

    const customData = {
      paymentId,
      senderNickname,
      senderEmail,
      receiverNickname,
      receiverPhone,
      zipCode: zoneCode,
      streetAddress,
      detailAddress,
      deliveryMessage,
      orderItems: parsedTamaOrder,
    };

    let redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/order/mobile?paymentId=${paymentId}`;
    if (inCart) redirectUrl += "&inCart=true";

    const response = await PortOne.requestPayment({
      storeId: "store-f9c6de63-d746-420d-88c6-0a6815d4352b",
      paymentId: paymentId,
      orderName: orderName,
      totalAmount: itemTotalPrice,
      currency: "CURRENCY_KRW",
      channelKey: TOSS_PAYMENTS_CHANNEL_KEY,
      payMethod: payMethod,
      redirectUrl: redirectUrl,
      //oauth 계정은 휴대폰 번호가 없음
      customer: {
        fullName: senderNickname,
        //...(senderPhone && { phoneNumber: senderPhone }),
        email: senderEmail,
      },
      customData,
    });

    if (response?.code !== undefined) {
      // 오류 발생
      alert(response.message);
      return;
    }
    //모바일 결제는 redirectUrl
    orderOnPc();

    async function orderOnPc() {
      //2단계-주문 API 호출
      const fetchUrl =
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/` +
        (authContext?.isLogined ? "member" : "guest") +
        `?paymentId=${paymentId}`;

      const token = localStorage.getItem("tamaAccessToken");

      const fetchHeader: Record<string, string> = {
        "Content-Type": "application/json",
        ...(authContext?.isLogined &&
          token && { Authorization: `Bearer ${token}` }),
      };

      //FETCH 한 후에 표시하는게 더 적절하지만, 그렇게하면 모달이 안뜨네요
      simpleModalContext?.setMessage("결제 진행 중.. 나가지 마세요");
      simpleModalContext?.setIsOpenSimpleModal(true);

      const notifiedRes = await fetch(fetchUrl, {
        method: "POST",
        headers: fetchHeader,
      });

      const notifiedJson: SimpleResponseType = await notifiedRes.json();
      simpleModalContext?.setMessage(notifiedJson.message);

      if (notifiedRes.status === 201) {
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
        //setSenderPhone(member.phone);
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

      {!authContext?.isLogined && !isAgreed && (
        <Agreements isAgreed={isAgreed} setIsAgreed={setIsAgreed} />
      )}

      {authContext?.isLogined && <OrderForm s/>}
    </article>
  );
};
