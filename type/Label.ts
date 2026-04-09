// OrderResponse Type

//다국어의 경우는 타입 없는게 날지도
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "주문 접수",
  IN_DELIVERY: "배송 중",
  DELIVERED: "배송 완료",
  COMPLETED: "구매 확정",
  CANCEL_RECEIVED: "취소 접수",
  IN_RETURN: "반품 중",
  RETURNED: "반품 완료",
  IN_REFUND: "환불 중",
  REFUNDED: "환불 완료",
  PG_CANCEL_ERROR: "결제 취소 중"
};
