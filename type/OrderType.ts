// OrderResponse Type

type AdminOrderResponse = {
  content: ContentAdminOrderResponse[];
  page: PageType;
};

type ContentAdminOrderResponse = {
  id: number; // orderId
  orderDate: string;
  buyerName: string;
  status: OrderStatus;
  delivery: DeliveryResponse;
  orderItems: OrderItemResponse[];
};

type OrderResponse = {
  content: ContentOrderResponse[];
  page: PageType;
};

type GuestOrderResponse = {
  id: number; // orderId
  orderDate: string;
  status: OrderStatus;
  delivery: DeliveryResponse;
  orderItems: OrderItemResponse[];
};

type ContentOrderResponse = {
  id: number; // orderId
  orderDate: string;
  status: OrderStatus;
  delivery: DeliveryResponse;
  usedCouponPrice: number;
  usedPoint: number;
  shippingFee: number;
  orderItems: OrderItemResponse[];
};

// OrderItemResponse Type
type OrderItemResponse = {
  orderItemId: number;
  name: string;
  color: string;
  size: string;
  orderPrice: number;
  count: number;
  uploadFile: UploadFileType;
  isReviewWritten: boolean;
};

//  Enum → 유니온 타입 변경
type OrderStatus =
  | "ORDER_RECEIVED" // 주문 접수
  | "IN_DELIVERY" // 배송 중 (출고 진행 과정 포함)
  | "DELIVERED" // 배송 완료
  | "COMPLETED" // 구매 확정
  | "CANCEL_RECEIVED" // 취소 접수 (사용자가 취소를 접수하면 운영자가 상황에 따라 반품 or 환불로 결정)
  | "IN_RETURN" // 반품 중
  | "RETURNED" // 반품 완료
  | "IN_REFUND" // 환불 중 (반품 없이 결제 환불 — 예: 상품 파손, 오염 등)
  | "REFUNDED"; // 환불 완료



// DeliveryResponse Type
type DeliveryResponse = {
  zipCode: string; // 우편번호
  street: string; // 도로명 주소
  detail: string; // 상세 주소
  message: string;
  receiverNickname: string;
  receiverPhone: string;
};

type SenderFormState = {
  senderNickname: string;
  senderEmail: string;
  deliveryMessage: string;
};

type ReceiverFormState = {
  receiverNickname: string;
  receiverPhone: string;
  zoneCode: number | undefined;
  streetAddress: string;
  detailAddress: string;
  addressName: string;
  memberAddresses: AddressResponse[];
  hasAddress: boolean;
};
