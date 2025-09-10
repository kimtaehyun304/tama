"use client";
import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default () => {
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const searchParams = useSearchParams();
  //쇼핑백에서 구매하면 url 파라미터가 붙어서옴
  const inCart = searchParams.get("inCart");
  const paymentId = searchParams.get("paymentId");
  const router = useRouter();
  const [text, setText] = useState<string>(
    "결제가 끝나면 주문 조회로 이동합니다."
  );

  useEffect(() => {
    if (authContext?.isLogined === undefined) return;

    orderOnMobile();
  }, [authContext]);

  async function orderOnMobile() {
    const memberOrGuest = authContext?.isLogined ? "member" : "guest";
    const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${memberOrGuest}?paymentId=${paymentId}`;
    const token = localStorage.getItem("tamaAccessToken");

    const fetchHeader: Record<string, string> = {
      "Content-Type": "application/json",
      ...(authContext?.isLogined &&
        token && { Authorization: `Bearer ${token}` }),
    };

    //FETCH 한 후에 표시하는게 더 적절하지만, 그렇게하면 모달이 안뜨네요 (?잘되네 뭐지)
    simpleModalContext?.setMessage("결제 진행 중.. 나가지 마세요");
    simpleModalContext?.setIsOpenSimpleModal(true);

    const resultRes = await fetch(fetchUrl, {
      method: "POST",
      headers: fetchHeader,
    });

    const notifiedJson: SimpleResponseType = await resultRes.json();
    simpleModalContext?.setMessage(notifiedJson.message);
    setText(notifiedJson.message);

    if (resultRes.status != 201) router.push("/order");

    if (resultRes.status == 201) {
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

  return (
    <section>
      <div className="text-center">{text}</div>
    </section>
  );
};
