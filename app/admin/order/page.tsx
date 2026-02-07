"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import MyPagination from "@/components/MyPagination";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default () => {
  const [orders, setOrders] = useState<AdminOrderResponse>();
  const authContext = useContext(AuthContext);
  const [cancelOrderDisable, setCancelOrderDisable] = useState<boolean>(false);
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
          },
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

  async function cancelOrder(orderId: number, isFreeOrder: boolean) {
    if (authContext?.isLogined) {
      setCancelOrderDisable(true);
      simpleModalContext?.setMessage("결제 취소중.. 나가지 마세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
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
            isFreeOrder: isFreeOrder,
          }),
        },
      );
      const ordersJson: SimpleResponseType = await res.json();
      simpleModalContext?.setMessage(ordersJson.message);

      //화면에 주문취소 반영
      if (res.ok) {
        setOrders((prevOrders) => {
          if (!prevOrders) return prevOrders; // prevOrders가 undefined면 그대로 반환

          return {
            ...prevOrders,
            content: prevOrders.content.map((order) =>
              order.id === orderId
                ? { ...order, status: "CANCEL_RECEIVED" }
                : order,
            ),
          };
        });
      }
      setCancelOrderDisable(false);
    }
  }

  //forbiddebScreen 띄우면 화면 바뀌어서 눈 아픔
  if (!orders) {
    return null;
  }

  return (
    <section className="space-y-4">
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

          {(order.status == "ORDER_RECEIVED" ||
            order.status == "DELIVERED") && (
            <button
              onClick={() =>
                cancelOrder(
                  order.id,
                  order.orderItems.reduce(
                    (sum, item) => sum + item.orderPrice * item.count,
                    0,
                  ) +
                    order.shippingFee -
                    order.usedCouponPrice -
                    order.usedPoint ==
                    0,
                )
              }
              className="border bg-black text-white p-2"
              disabled={cancelOrderDisable}
            >
              주문 취소
            </button>
          )}

          <div className="grid xl:grid-cols-2 gap-3">
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
                  unoptimized
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
