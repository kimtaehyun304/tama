"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoginScreen from "@/components/LoginScreen";
import ReviewFormModal from "@/components/modal/ReviewFormModal";
import MyPagination from "@/components/MyPagination";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "주문 접수",
  IN_DELIVERY: "배송 중",
  DELIVERED: "배송 완료",
  COMPLETED: "구매 확정",
  CANCEL_RECEIVED: "취소 접수",
  IN_RETURN: "반품 중",
  RETURNED: "반품 완료",
  IN_REFUND: "환불 중",
  REFUNDED: "환불 완료",
};

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
  const [isLoadingFetchOrder, setIsLoadingFetchOrder] = useState<boolean>(true);

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
    setIsLoadingFetchOrder(false);
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

  async function cancelOrder(orderId: number, isFreeOrder: boolean) {
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
            isFreeOrder: isFreeOrder,
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
              order.id === orderId
                ? { ...order, status: "CANCEL_RECEIVED" }
                : order
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
              <div>{ORDER_STATUS_LABELS[order.status]}</div>
            </div>
            <div>
              ({order.delivery.zipCode}) {order.delivery.street}{" "}
              {order.delivery.detail}
            </div>
            <div>{order.delivery.message}</div>
          </section>

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
                      {item.count != 1 && "총"}
                      {(item.orderPrice * item.count).toLocaleString("ko-kr")}원
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

          <section className="">
            <div className="inline-block  space-y-1">
              <div className="flex gap-x-20">
                <span>상품 금액</span>
                <span className="grow text-right">
                  {order.orderItems
                    .reduce(
                      (sum, item) => sum + item.orderPrice * item.count,
                      0
                    )
                    .toLocaleString("ko-kr")}
                  원
                </span>
              </div>
              <div className="flex">
                <span>배송비</span>
                <span className="grow text-right">
                  {order.shippingFee.toLocaleString("ko-kr")}원
                </span>
              </div>
              <div className="flex justify-center">
                <span>쿠폰 할인 금액</span>
                <span className="grow text-right">
                  {order.usedCouponPrice > 0
                    ? -order.usedCouponPrice.toLocaleString("ko-kr")
                    : 0}
                  원
                </span>
              </div>
              <div className="flex justify-center">
                <span>적립금 사용</span>
                <span className="grow text-right">
                  {order.usedPoint > 0
                    ? -order.usedPoint.toLocaleString("ko-kr")
                    : 0}
                  원
                </span>
              </div>
              <div className="flex justify-center">
                <span className="font-bold">총</span>
                <span className="grow text-right font-bold">
                  {(
                    order.orderItems.reduce(
                      (sum, item) => sum + item.orderPrice * item.count,
                      0
                    ) +
                    order.shippingFee -
                    order.usedCouponPrice -
                    order.usedPoint
                  ).toLocaleString("ko-kr")}
                  원
                </span>
              </div>
            </div>
          </section>

          {(order.status == "ORDER_RECEIVED" ||
            order.status == "DELIVERED") && (
            <button
              onClick={() =>
                cancelOrder(
                  order.id,
                  order.orderItems.reduce(
                    (sum, item) => sum + item.orderPrice * item.count,
                    0
                  ) +
                    order.shippingFee -
                    order.usedCouponPrice -
                    order.usedPoint ==
                    0
                )
              }
              disabled={cancelOrderDisable}
              className="border bg-black text-white p-2"
            >
              주문 취소
            </button>
          )}
        </section>
      ))}

      {!isLoadingFetchOrder && orders.content.length == 0 && (
        <div>주문한 상품이 없습니다</div>
      )}

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
