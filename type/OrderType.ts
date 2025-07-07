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

// OrderStatus Enum → 유니온 타입
type OrderStatus =
  | "PAYMENT"
  | "CHECK"
  | "DELIVERY"
  | "COMPLETE"
  | "CANCEL"
  | "REFUND";

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
