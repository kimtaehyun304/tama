import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { useContext, useEffect, useState } from "react";
import { UseFormSetFocus, UseFormWatch } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";
import PortOne from "@portone/browser-sdk/v2";
import { AuthContext } from "@/components/context/AuthContext";
import { PayMethodEng } from "./OrderForm";

const TOSS_PAYMENTS_CHANNEL_KEY =
  "channel-key-8f9a41df-ae97-4fbe-83b3-4d5f7b45944d";

type Props = {
  senderFormWatch: UseFormWatch<SenderFormState>;
  receiverFormWatch: UseFormWatch<ReceiverFormState>;
  senderFormSetFocus: UseFormSetFocus<SenderFormState>;
  receiverFormSetFocus: UseFormSetFocus<ReceiverFormState>;
  orderTotalPrice: number;
  selectedPayMethodEng: PayMethodEng;
  orderName: string;
};

export default ({
  senderFormWatch,
  receiverFormWatch,
  senderFormSetFocus,
  receiverFormSetFocus,
  orderTotalPrice,
  selectedPayMethodEng,
  orderName,
}: Props) => {
  const SHIPPING_FEE = orderTotalPrice >= 40000 ? 0 : 3000;

  const router = useRouter();
  const searchParams = useSearchParams();
  //쇼핑백에서 구매하면 url 파라미터가 붙어서옴
  const inCart = searchParams.get("inCart");

  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);

  function validateForm() {
    const senderNickname = senderFormWatch("senderNickname");
    const senderEmail = senderFormWatch("senderEmail");
    const receiverNickname = receiverFormWatch("receiverNickname");
    const receiverPhone = receiverFormWatch("receiverPhone");
    const zoneCode = receiverFormWatch("zoneCode");
    const streetAddress = receiverFormWatch("streetAddress");
    const detailAddress = receiverFormWatch("detailAddress");
    const deliveryMessage = senderFormWatch("deliveryMessage");

    if (!authContext?.isLogined) {
      if (!senderNickname) {
        senderFormSetFocus("senderNickname");
        simpleModalContext?.setMessage("이름을 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return false;
      }

      if (!senderEmail) {
        senderFormSetFocus("senderEmail");
        simpleModalContext?.setMessage("이메일을 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return false;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(senderEmail)) {
        senderFormSetFocus("senderEmail");
        simpleModalContext?.setMessage("유효한 이메일 주소를 입력해주세요");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return false;
      }
    }

    if (!receiverNickname) {
      receiverFormSetFocus("receiverNickname");
      simpleModalContext?.setMessage("수령인 이름을 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return false;
    }

    if (!/^\d+$/.test(String(receiverPhone))) {
      receiverFormSetFocus("receiverPhone");
      simpleModalContext?.setMessage("수령인 전화번호를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return false;
    }

    if (!/^\d+$/.test(String(zoneCode))) {
      receiverFormSetFocus("zoneCode");
      simpleModalContext?.setMessage("우편번호를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return false;
    }

    if (!streetAddress) {
      receiverFormSetFocus("streetAddress");
      simpleModalContext?.setMessage("도로명 주소를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return false;
    }

    if (!detailAddress) {
      receiverFormSetFocus("detailAddress");
      simpleModalContext?.setMessage("상세 주소를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return false;
    }

    if (!deliveryMessage) {
      senderFormWatch("deliveryMessage");
      simpleModalContext?.setMessage("배송 메시지를 입력해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return false;
    }

    return true;
  }

  async function requestPayment(
    payMethod: PayMethodEng,
    itemTotalPrice: number,
    orderName: string
  ) {
    if (!validateForm()) return;
    //1단계-PG사 결제
    const paymentId = `payment-${crypto.randomUUID()}`;
    //2단계-주문 API 호출
    const tamaOrder = localStorage.getItem("tamaOrder");
    let parsedTamaOrder: StorageItemType[] = [];
    if (tamaOrder) parsedTamaOrder = JSON.parse(tamaOrder);

    const customData = {
      paymentId,
      senderNickname: senderFormWatch("senderNickname"),
      senderEmail: senderFormWatch("senderEmail"),
      receiverNickname: receiverFormWatch("receiverNickname"),
      receiverPhone: receiverFormWatch("receiverPhone"),
      zipCode: receiverFormWatch("zoneCode"),
      streetAddress: receiverFormWatch("streetAddress"),
      detailAddress: receiverFormWatch("detailAddress"),
      deliveryMessage: senderFormWatch("deliveryMessage"),
      orderItems: parsedTamaOrder,
    };

    let redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/order/mobile?paymentId=${paymentId}`;
    console.log(redirectUrl)
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
        fullName: senderFormWatch("senderNickname"),
        //...(senderPhone && { phoneNumber: senderPhone }),
        email: senderFormWatch("senderEmail"),
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

  return (
    <section className="text-center m-4">
      <div className="bg-[#f5f5f5] inline-block p-4 space-y-3">
        <div className="flex justify-center gap-x-20">
          <span className="grow">상품금액</span>
          <span className="grow">
            {orderTotalPrice.toLocaleString("ko-KR")}원
          </span>
        </div>
        <div className="flex justify-center">
          <span className="">배송비</span>
          <span className="grow text-right">
            {SHIPPING_FEE.toLocaleString("ko-KR")}원
          </span>
        </div>
        <hr />
        <div className="flex font-semibold text-xl">
          <span>총</span>
          <span className="grow text-right">
            {(orderTotalPrice + SHIPPING_FEE).toLocaleString("ko-KR")}
          </span>
          원
        </div>
        <div>
          <button
            className="bg-[#131922] text-[#fff] border p-4 w-full"
            onClick={(event) => {
              event.currentTarget.disabled = true;
              simpleModalContext?.setMessage("결제창 로딩중..");
              simpleModalContext?.setIsOpenSimpleModal(true);
              requestPayment(selectedPayMethodEng, orderTotalPrice, orderName);
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </section>
  );
};
