import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { useContext } from "react";
import { UseFormSetFocus, UseFormWatch } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import PortOne from "@portone/browser-sdk/v2";
import { AuthContext } from "@/components/context/AuthContext";

export type PayMethodEng = (typeof PAY_METHOD_LABELS)[number]["eng"];

export const PAY_METHOD_LABELS = [
  //{ eng: "EASY_PAY", kor: "간편 결제" },
  { eng: "CARD", kor: "신용/체크카드" },
  //{ eng: PayMethodEnum.MOBILE, kor: "휴대폰 결제" },
  { eng: "TRANSFER", kor: "계좌이체" },
] as const;

const TOSS_PAYMENTS_CHANNEL_KEY =
  "channel-key-5573ee4c-63d3-467b-b3d6-5ef987952e96";
//const EXIM_BAY_CHANNEL_KEY = "channel-key-352a50be-65d2-4b3c-97c1-5a606086aa9c";
//const KAKAO_PAY_CHANNEL_KEY = "channel-key-ffacf44e-5508-446e-9b4c-d136cfe12478";
const CHANNEL_KEY = TOSS_PAYMENTS_CHANNEL_KEY;

type Props = {
  senderFormWatch: UseFormWatch<SenderFormState>;
  receiverFormWatch: UseFormWatch<ReceiverFormState>;
  senderFormSetFocus: UseFormSetFocus<SenderFormState>;
  receiverFormSetFocus: UseFormSetFocus<ReceiverFormState>;
  orderItemsPrice: number;
  selectedPayMethodEng: PayMethodEng;
  selectedMemberCouponId: number | null;
  orderName: string;
  couponPrice: number;
  usedPoint: number;
};

export default ({
  senderFormWatch,
  receiverFormWatch,
  senderFormSetFocus,
  receiverFormSetFocus,
  orderItemsPrice,
  selectedPayMethodEng,
  selectedMemberCouponId,
  orderName,
  couponPrice,
  usedPoint,
}: Props) => {
  const SHIPPING_FEE = orderItemsPrice >= 40000 ? 0 : 3000;

  const router = useRouter();
  const searchParams = useSearchParams();
  //쇼핑백에서 구매하면 url 파라미터가 붙어서옴
  const inCart = searchParams.get("inCart");

  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);

  async function orderHandler(
    selectedPayMethodEng: PayMethodEng,
    orderFinalPrice: number,
    orderName: string
  ) {
    if (!validateForm()) return;

    if (orderItemsPrice + SHIPPING_FEE - (couponPrice + usedPoint) === 0) {
      orderForFree();
      return;
    }

    order(selectedPayMethodEng, orderFinalPrice, orderName);

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
  }

  async function order(
    payMethod: PayMethodEng,
    orderFinalPrice: number,
    orderName: string
  ) {
    requestPayment();
    async function requestPayment() {
      simpleModalContext?.setMessage("결제창 로딩중..");
      simpleModalContext?.setIsOpenSimpleModal(true);

      const paymentId = `payment-${crypto.randomUUID()}`;
      let redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/order/mobile?paymentId=${paymentId}`;
      if (inCart) redirectUrl += "&inCart=true";

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
        memberCouponId: selectedMemberCouponId,
        usedPoint: usedPoint,
        orderItems: parsedTamaOrder,
      };

      const portOneRes = await PortOne.requestPayment({
        storeId: "store-f9c6de63-d746-420d-88c6-0a6815d4352b",
        paymentId: paymentId,
        orderName: orderName,
        totalAmount: orderFinalPrice,
        currency: "CURRENCY_KRW",
        channelKey: CHANNEL_KEY,
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

      //모바일 결제는 redirectUrl(moibleUrl)에서 결제
      if (portOneRes?.code !== undefined) {
        // 오류 발생
        simpleModalContext?.setMessage(portOneRes.message!);
        return;
      }

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

      const res = await fetch(fetchUrl, {
        method: "POST",
        headers: fetchHeader,
      });

      const notifiedJson: SimpleResponseType = await res.json();
      simpleModalContext?.setMessage(notifiedJson.message);

      if (res.status === 201) {
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

  //무료 주문이라, PG사 안거치고 바로 주문
  async function orderForFree() {
    const tamaOrder = localStorage.getItem("tamaOrder");
    let parsedTamaOrder: StorageItemType[] = [];
    if (tamaOrder) parsedTamaOrder = JSON.parse(tamaOrder);
    const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/free/member`;

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
      body: JSON.stringify({
        senderNickname: senderFormWatch("senderNickname"),
        senderEmail: senderFormWatch("senderEmail"),
        receiverNickname: receiverFormWatch("receiverNickname"),
        receiverPhone: receiverFormWatch("receiverPhone"),
        zipCode: receiverFormWatch("zoneCode"),
        streetAddress: receiverFormWatch("streetAddress"),
        detailAddress: receiverFormWatch("detailAddress"),
        deliveryMessage: senderFormWatch("deliveryMessage"),
        memberCouponId: selectedMemberCouponId,
        usedPoint: usedPoint,
        orderItems: parsedTamaOrder,
      }),
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
      router.push("/myPage/order");

      return;
    }
  }

  return (
    <section className="text-center m-4">
      <div className="bg-[#f5f5f5] inline-block p-4 space-y-3">
        <div className="flex justify-center">
          <span className="">배송비</span>
          <span className="grow text-right">
            {SHIPPING_FEE.toLocaleString("ko-KR")}원
          </span>
        </div>

        <div className="flex justify-center gap-x-20">
          <span className="grow">상품금액</span>
          <span className="grow">
            {orderItemsPrice.toLocaleString("ko-KR")}원
          </span>
        </div>

        <div className="flex justify-center">
          <span className="">쿠폰</span>
          <span className="grow text-right">
            {couponPrice > 0 ? "-" + couponPrice.toLocaleString("ko-kr") : 0}원
          </span>
        </div>

        <div className="flex justify-center">
          <span className="">포인트</span>
          <span className="grow text-right">
            {usedPoint > 0 ? "-" + usedPoint.toLocaleString("ko-kr") : 0}원
          </span>
        </div>

        <hr />
        <div className="flex font-semibold text-xl">
          <span>총</span>
          <span className="grow text-right">
            {(
              orderItemsPrice +
              SHIPPING_FEE -
              (couponPrice + usedPoint)
            ).toLocaleString("ko-KR")}
          </span>
          원
        </div>
        <div>
          <button
            className="bg-[#131922] text-[#fff] border p-4 w-full"
            onClick={(event) => {
              event.currentTarget.disabled = true;
              orderHandler(
                selectedPayMethodEng,
                orderItemsPrice + SHIPPING_FEE - (couponPrice + usedPoint),
                orderName
              );
              event.currentTarget.disabled = false;
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </section>
  );
};
