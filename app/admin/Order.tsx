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
import ForbiddenScreen from "@/components/ForbiddenScreen";

export default () => {
  const [orders, setOrders] = useState<AdminOrderResponse>();
  const authContext = useContext(AuthContext);
  const loginModalContext = useContext(LoginModalContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const searchParams = useSearchParams();
  const pagePrams = Number(searchParams.get("page")) || 1;
  const pageSize = 10;

  useEffect(() => {
    async function fetchOrder() {
      if (authContext?.isLogined) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?page=${pagePrams}&size=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("tamaAccessToken"),
            },
          }
        );
        const ordersJson = await res.json();
        if (!res.ok) {
          return;
        }
        setOrders(ordersJson);
      }
    }
    fetchOrder();
  }, [authContext?.isLogined, pagePrams]);

  async function cancelOrder(orderId: number) {
    if (authContext?.isLogined) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/member/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          body: JSON.stringify({
            orderId: orderId,
          }),
        }
      );
      const ordersJson: SimpleResponseType = await res.json();
      simpleModalContext?.setMessage(ordersJson.message);
      simpleModalContext?.setIsOpenSimpleModal(true);
    }
  }

  if (!orders) {
    return <ForbiddenScreen />;
  }

  return (
    <section className="space-y-4 grow">
      <div className="font-bold text-xl">주문/배송 조회</div>
      {orders.content.map((order, index) => (
        <section className="border p-4 space-y-2" key={`order-${index}`}>
          <section className="space-y-2 ">
            <div className="flex gap-x-1">
              <div className="font-bold">{order.orderDate}</div>
              <div>{order.status}</div>
            </div>
            <div>{order.buyerName}</div>
            <div>
              ({order.delivery.zipCode}) {order.delivery.street}{" "}
              {order.delivery.detail}
            </div>
            <div>{order.delivery.message}</div>
          </section>

          {(order.status == "PAYMENT" || order.status == "CHECK") && (
            <button
              onClick={() => cancelOrder(order.id)}
              className="border bg-black text-white p-2"
            >
              주문 취소
            </button>
          )}

          <div className=" grid xl:grid-cols-2 gap-3">
            {order.orderItems.map((item, index) => (
              <div
                className="border flex gap-x-4 p-2"
                key={`orderItems-${index}`}
              >
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
          </div>
        </section>
      ))}
      <MyPagination pageCount={orders.page.pageCount} pageRangeDisplayed={5} />
    </section>
  );
};
