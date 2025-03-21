"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { useContext, useState } from "react";
import { useEffect } from "react";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import LoginScreen from "@/components/LoginScreen";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import MyPagination from "@/components/MyPagination";

export default () => {
  const [order, setOrder] = useState<GuestOrderResponse>();
  const authContext = useContext(AuthContext);
  const loginModalContext = useContext(LoginModalContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<number>();
  const [buyerName, setBuyerName] = useState<string>();

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

          {(order.status == "PAYMENT" || order.status == "CHECK") && (
            <button
              onClick={cancelOrder}
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
                  src={item.imageSrc}
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
