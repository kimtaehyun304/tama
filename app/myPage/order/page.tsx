"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoginScreen from "@/components/LoginScreen";
import ReviewFormModal from "@/components/modal/ReviewFormModal";
import MyPagination from "@/components/MyPagination";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default () => {
  const [orders, setOrders] = useState<OrderResponse>();
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const searchParams = useSearchParams();
  const pagePrams = Number(searchParams.get("page")) || 1;
  const pageSize = 10;
  const [isOpenReviewFormModal, setIsOpenReviewFormModal] =
    useState<boolean>(false);
  const [memberInformation, setMemberInformation] =
    useState<MemberInformationType>();
  const [orderItemName, setOrderItemName] = useState<string>("");
  const [orderItemId, setOrderItemId] = useState<number | undefined>(undefined);
  const [cancelOrderDisable, setCancelOrderDisable] = useState<boolean>(false);

  useEffect(() => {
    async function fetchOrder() {
      if (authContext?.isLogined) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/member?page=${pagePrams}&size=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("tamaAccessToken"),
            },
          }
        );
        const ordersJson: OrderResponse = await res.json();
        setOrders(ordersJson);
      }
    }
    fetchOrder();
  }, [authContext?.isLogined, pagePrams]);

  useEffect(() => {
    async function fetchMember() {
      if (authContext?.isLogined) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/information`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("tamaAccessToken"),
            },
          }
        );

        if (!res.ok) {
          const memberInformationJson: SimpleResponseType = await res.json();
          alert(memberInformationJson.message);
          return;
        }

        const memberInformationJson: MemberInformationType = await res.json();
        setMemberInformation(memberInformationJson);
      }
    }
    fetchMember();
  }, [authContext?.isLogined]);

  async function cancelOrder(orderId: number) {
    if (authContext?.isLogined) {
      setCancelOrderDisable(true);
      //FETCH 한 후에 표시하는게 더 적절하지만, 그렇게하면 모달이 안뜨네요
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
          }),
        }
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
              order.id === orderId ? { ...order, status: "CANCEL" } : order
            ),
          };
        });
      }
      setCancelOrderDisable(false);
    }
  }

  if (!orders || !authContext?.isLogined) {
    return <LoginScreen />;
  }

  if (!memberInformation) return;

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
            <div>
              ({order.delivery.zipCode}) {order.delivery.street}{" "}
              {order.delivery.detail}
            </div>
            <div>{order.delivery.message}</div>
          </section>

          {(order.status == "PAYMENT" || order.status == "CHECK") && (
            <button
              onClick={() => cancelOrder(order.id)}
              disabled={cancelOrderDisable}
              className="border bg-black text-white p-2"
            >
              주문 취소
            </button>
          )}

          {order.orderItems.map((item, index) => (
            <div key={`orderItems-${index}`}>
              <div className="border flex gap-x-4 p-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${item.uploadFile.storedFileName}`}
                  alt={item.name}
                  width={100}
                  height={100}
                />

                <div className="flex gap-y-2 ">
                  <div>
                    <div>{item.name}</div>
                    <div>
                      {item.color}/{item.size}
                    </div>
                    <div>{item.count}개 주문</div>
                    <div className="text-sm text-[#aaa]">
                      {item.orderPrice.toLocaleString("ko-kr")}원
                    </div>
                  </div>
                </div>
              </div>
              {item.isReviewWritten == false && (
                <button
                  onClick={() => {
                    setOrderItemId(item.orderItemId);
                    setOrderItemName(`${item.name}/${item.color}/${item.size}`);
                    setIsOpenReviewFormModal(true);
                  }}
                  className="border p-2"
                >
                  리뷰 작성
                </button>
              )}
            </div>
          ))}
        </section>
      ))}

      <ReviewFormModal
        isOpenModal={isOpenReviewFormModal}
        setIsOpenModal={setIsOpenReviewFormModal}
        orderItemName={orderItemName}
        memberInformation={memberInformation}
        orderItemId={orderItemId}
        onReviewSuccess={() => {
          // orders 상태 업데이트 (isReviewWritten을 true로 변경)
          setOrders((prevOrders) => {
            if (!prevOrders) return prevOrders; // prevOrders가 undefined면 그대로 반환

            return {
              ...prevOrders,
              content: prevOrders.content.map((order) => ({
                ...order,
                orderItems: order.orderItems.map((item) =>
                  item.orderItemId === orderItemId
                    ? { ...item, isReviewWritten: true }
                    : item
                ),
              })),
            };
          });
        }}
      />

      <MyPagination pageCount={orders.page.pageCount} pageRangeDisplayed={5} />
    </section>
  );
};
