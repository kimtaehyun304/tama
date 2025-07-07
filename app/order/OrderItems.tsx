import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import Image from "next/image";

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  orderItems: StorageItemDetailType[];
  setOrderItems: Dispatch<SetStateAction<StorageItemDetailType[]>>;
  setOrderTotalPrice: Dispatch<SetStateAction<number>>;
  setOrderName: Dispatch<SetStateAction<string>>;
};

export default ({
  orderItems,
  setOrderItems,
  setOrderTotalPrice,
  setOrderName,
}: Props) => {
  const simpleModalContext = useContext(SimpleModalContext);

  //const [isLoading, setIsLoading] = useState(true);

  const [orderStorageMap, setOrderStorageMap] = useState<Map<number, number>>(
    new Map()
  );

  useEffect(() => {
    async function fetchOrderItem() {
      const jsonStrOrder = localStorage.getItem("tamaOrder");
      const parsedOrder: StorageItemType[] = jsonStrOrder
        ? JSON.parse(jsonStrOrder)
        : null;

      if (!parsedOrder || parsedOrder.length === 0) {
        simpleModalContext?.setMessage("주문할 상품이 없습니다");
        simpleModalContext?.setIsOpenSimpleModal(true);
        return;
      }

      const itemStocks: number[] = [];
      parsedOrder?.forEach((item) => {
        itemStocks.push(item.colorItemSizeStockId);
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/colorItemSizeStock?id=${itemStocks.join()}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json(); // 에러 응답을 따로 파싱
        alert(errorResponse.message);
        return;
      }

      const orderItemsJson: StorageItemDetailType[] = await res.json(); // 정상 데이터 처리
      setOrderItems(orderItemsJson);
    }
    fetchOrderItem();

    function handleSetOrderStorageMap() {
      const stringOrder = localStorage.getItem("tamaOrder");
      const parsedOrder: StorageItemType[] =
        stringOrder && JSON.parse(stringOrder);
      const newOrderMap = new Map();
      parsedOrder?.forEach((orderItem) => {
        newOrderMap?.set(orderItem.colorItemSizeStockId, orderItem.orderCount);
      });
      setOrderStorageMap(newOrderMap);
    }
    handleSetOrderStorageMap();

    //setIsLoading(false);
  }, []);

  useEffect(() => {
    if (orderItems.length === 0) return;

    setOrderTotalPrice(
      orderItems.reduce(
        (total, orderItem) =>
          total +
          (orderItem.discountedPrice ?? orderItem.price) *
            (orderStorageMap.get(orderItem.sizeStock.id) ?? 0),
        0
      )
    );

    setOrderName(
      orderItems.length === 1
        ? orderItems[0].name
        : orderItems[0].name + " 등 " + orderItems.length
    );
  }, [orderItems]);

  return (
    <section>
      <div className="font-bold text-2xl p-[1%] border-b">주문상품</div>
      <div className="p-[2%] flex flex-col xl:grid xl:grid-cols-2 gap-3">
        {orderItems.map((item, index) => (
          <div className="border flex gap-x-4 p-2" key={`item-${index}`}>
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
                  {item.color}/{item.sizeStock.size}
                </div>
                <div>{orderStorageMap.get(item.sizeStock.id)}개 주문</div>
              </div>
              <div className="text-sm text-[#aaa]">
                {item.discountedPrice &&
                  `${(
                    item.price * orderStorageMap.get(item.sizeStock.id)!
                  ).toLocaleString("ko-kr")}원`}
              </div>
              <div className="text-2xl font-semibold">
                {item.discountedPrice
                  ? `${(
                      item.discountedPrice *
                      orderStorageMap.get(item.sizeStock.id)!
                    ).toLocaleString("ko-kr")}원`
                  : `${(
                      item.price * orderStorageMap.get(item.sizeStock.id)!
                    ).toLocaleString("ko-kr")}원`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
