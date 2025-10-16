"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import Image from "next/image";
import { useContext, useState } from "react";

export default () => {
  const [order, setOrder] = useState<GuestOrderResponse>();
  const simpleModalContext = useContext(SimpleModalContext);
  const [orderId, setOrderId] = useState<number>();
  const [buyerName, setBuyerName] = useState<string>();
  const [cancelOrderDisable, setCancelOrderDisable] = useState<boolean>(false);

  async function fetchOrder() {
    const credentials = btoa(
      unescape(encodeURIComponent(`${buyerName}:${orderId}`))
    );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/guest`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );
    const ordersJson = await res.json();

    if (!res.ok) {
      alert(ordersJson.message);
      return;
    }

    setOrder(ordersJson);
  }

  async function cancelOrder() {
    setCancelOrderDisable(true);
    simpleModalContext?.setMessage("결제 취소중.. 나가지 마세요");
    simpleModalContext?.setIsOpenSimpleModal(true);
    const credentials = btoa(
      unescape(encodeURIComponent(`${buyerName}:${orderId}`))
    );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/guest/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    const ordersJson: SimpleResponseType = await res.json();
    simpleModalContext?.setMessage(ordersJson.message);
    simpleModalContext?.setIsOpenSimpleModal(true);

    //화면에 주문취소 반영
    if (res.ok) {
      setOrder((prevOrder) => {
        if (!prevOrder) return prevOrder; // prevOrders가 undefined면 그대로 반환

        return {
          ...prevOrder,
          status: "CANCEL_RECEIVED",
        };
      });
    }
    setCancelOrderDisable(false);
  }

  return (
    <section className="mx-[5%]">
      <div className="font-bold text-xl text-center my-3">비회원 주문조회</div>
      {!order ? (
        <section className="flex flex-col gap-y-3 max-w-md mx-auto text-center my-3">
          <input
            type="text"
            placeholder="주문하신 분"
            className="border p-3 grow"
            onChange={(event) => {
              setBuyerName(event.target.value);
            }}
          />

          <input
            type="text"
            placeholder="주문번호"
            className="border p-3 grow"
            onChange={(event) => {
              setOrderId(Number(event.target.value));
            }}
          />

          <div>
            <button
              onClick={fetchOrder}
              className="border bg-black text-white p-3 w-full"
            >
              조회하기
            </button>
          </div>

          <div className="text-center">이메일을 학인해주세요</div>
        </section>
      ) : (
        <section className="border p-4 space-y-2">
          <section className="space-y-2 ">
            <div className="flex gap-x-1">
              <div className="font-bold">{order.orderDate}</div>
              <div>{order.status}</div>
            </div>
            <div>
              ({order.delivery.zipCode}) {order.delivery.street}{" "}
              {order.delivery.detail}
            </div>
            <div>{order.delivery.message}</div>
          </section>

          {(order.status == "ORDER_RECEIVED" || order.status == "DELIVERED") && (
            <button
              onClick={cancelOrder}
              disabled={cancelOrderDisable}
              className="border bg-black text-white p-2"
            >
              주문 취소
            </button>
          )}

          <section className=" grid xl:grid-cols-2 gap-3">
            {order.orderItems.map((item, index) => (
              <div
                className="border flex gap-x-4 p-2"
                key={`orderItems-${index}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${item.uploadFile.storedFileName}`}
                  alt={item.name}
                  width={100}
                  height={100}
                />

                <div className="flex flex-col gap-y-2 flex-1">
                  <div>
                    <div>{item.name}</div>
                    <div>
                      {item.color}/{item.size}
                    </div>
                    <div>{item.count}개 주문</div>
                  </div>
                  <div className="text-sm text-[#aaa]">
                    {item.orderPrice.toLocaleString("ko-kr")}원
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>
      )}
    </section>
  );
};
