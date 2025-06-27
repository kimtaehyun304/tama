import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

type Props = {
  colorItem: ColorItemType;
};

export default ({ colorItem }: Props) => {
  //옷 사이즈 바꿀때 사용
  const [stock, setStock] = useState(colorItem.sizeStocks[0].stock);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [orderCount, setOrderCount] = useState<number>(1);
  const [isOpenOutOfStockModal, setIsOpenOutOfStockModal] = useState(false);
  const simpleModalContext = useContext(SimpleModalContext);
  const router = useRouter();

  function changeItem(index: number) {
    setOrderCount(1);
    setSizeIndex(index);
    setStock(colorItem.sizeStocks[index].stock);
  }

  function plusOurderCount() {
    if (stock <= orderCount) {
      setIsOpenOutOfStockModal(true);
      return;
    }

    setOrderCount(orderCount + 1);
  }

  function minusOurderCount() {
    if (orderCount > 1) setOrderCount(orderCount - 1);
  }

  function putItemInShoppingBag() {
    const itemToPut = {
      colorItemSizeStockId: colorItem.sizeStocks[sizeIndex].id,
      orderCount: orderCount,
    };

    const jsonString = localStorage.getItem("tamaCart");

    if (jsonString) {
      const jsons: StorageItemType[] = JSON.parse(jsonString);
      const foundIndex = jsons.findIndex(
        (json) => json.colorItemSizeStockId === itemToPut.colorItemSizeStockId
      );

      if (foundIndex === -1) jsons.push(itemToPut);
      else jsons[foundIndex] = itemToPut;

      localStorage.setItem("tamaCart", JSON.stringify(jsons));
    } else localStorage.setItem("tamaCart", JSON.stringify(Array(itemToPut)));

    simpleModalContext?.setMessage("쇼핑백에 상품을 담았습니다.");
    simpleModalContext?.setIsOpenSimpleModal(true);
  }

  function orderItem() {
    if (stock < orderCount) {
      setIsOpenOutOfStockModal(true);
      return;
    }

    function putItemInOrder() {
      //쇼핑백을 통해 주문하면 배열이라 통일하려고 여기도 배열 씀
      const itemToPut = [
        {
          colorItemSizeStockId: colorItem.sizeStocks[sizeIndex].id,
          orderCount: orderCount,
        },
      ];
      localStorage.setItem("tamaOrder", JSON.stringify(itemToPut));
    }
    putItemInOrder();
    router.push("/order");
  }

  return (
    <div className="pt-3 xl:pt-0">
      {/*재고 부족 모달*/}
      <OutOfStockModal
        stock={stock}
        isOpenOutOfStockModal={isOpenOutOfStockModal}
        setIsOpenOutOfStockModal={setIsOpenOutOfStockModal}
      />
      {/*상품 설명 */}
      <div className="">
        <div className="flex justify-between">
          <span className="p-1 mt-1 text-[#d99c63] border border-[#d99c63] ">
            {colorItem.common.yearSeason}
          </span>
          <div className="flex">
            <Image
              src="/icon/icon-heart.png"
              alt="icon-heart"
              width={40}
              height={40}
            />
            <Image
              src="/icon/icon-share.png"
              alt="icon-share"
              width={40}
              height={40}
            />
          </div>
        </div>

        <div className="py-2 mt-3 text-[#a0a0a0]">
          공통 상품 코드 {colorItem.common.id}
        </div>
        <div className="py-2 text-xl">{colorItem.common.name}</div>
        <div className="py-2 flex items-end gap-x-4">
          {colorItem.discountedPrice && (
            <span className="font-semibold text-3xl text-[#d99c63]">
              {100 -
                Math.round((colorItem.discountedPrice / colorItem.price) * 100)}
              %
            </span>
          )}

          <span className="text-3xl">
            <span className="font-semibold">
              {colorItem.discountedPrice
                ? colorItem.discountedPrice.toLocaleString("ko-KR")
                : colorItem.price.toLocaleString("ko-KR")}
            </span>
            원
          </span>

          {colorItem.discountedPrice && (
            <span className="text-lg text-[#a0a0a0]">
              <span className="">
                {colorItem.price.toLocaleString("ko-KR")}
              </span>
              원
            </span>
          )}
        </div>
      </div>

      {/*배송 정보 및 구매 옵션 */}
      <div className="border-t-2 py-3 text-sm xl:text-xl  ">
        {/*배송 정보*/}
        <div className="grid gap-y-5 pb-3 border-b-2">
          {/*
              <div className="flex justify-between">
                <div className="font-semibold">카드혜택</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <span className="underline cursor-pointer pr-5">
                    할부혜택
                  </span>
                  <span className="underline cursor-pointer">
                    카드혜택 즉시할인
                  </span>
                </div>
              </div>
              */}
          <div className="flex justify-between">
            <div className="font-semibold">적립예정포인트</div>
            <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
              <span className="underline cursor-pointer">
                0.5%({Math.round(colorItem.price / 200)}P)
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-semibold">배송비</div>
            <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
              {colorItem.discountedPrice >= 40000
                ? "무료"
                : "3,000원 (40,000원 이상 결제 시 무료)"}
            </div>
          </div>
          <div className="flex justify-between ">
            <div className="font-semibold">배송기간</div>
            <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
              <div className="mb-3">
                15시 30분까지 결제 시{" "}
                <span className="font-semibold text-[#d99c63]">오늘 출발</span>
              </div>
              <div className="bg-[#f8f8f8] p-3 inline-block ">
                <div className="grid gap-y-3">
                  <div className="flex gap-x-4">
                    <div>D+1 도착확률</div>
                    <div>93.3%</div>
                  </div>
                  <div className="flex gap-x-4">
                    <div>D+2 도착확률</div>
                    <div>99.2%</div>
                  </div>
                  <div className="flex gap-x-4">
                    <div>D+3 도착확률</div>
                    <div>100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-y-5 py-3">
          <div className="flex justify-between">
            <div className="font-semibold">색상</div>
            <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
              <div className="mb-3 font-medium text-[#a0a0a0]">
                {colorItem.color}
              </div>
              <div className="flex gap-x-4 overflow-x-auto">
                {colorItem.relatedColorItems.map((related, index) => (
                  <Link
                    href={`/color-items/${related.id}`}
                    key={`relatedItem-${index}`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${related.uploadFile.storedFileName}`}
                      alt={related.color}
                      width={50}
                      height={50}
                      className={
                        related.id === colorItem.id
                          ? "border-[1px] border-black"
                          : ""
                      }
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/*구매 옵션 */}
          <div className="flex justify-between">
            <div className="font-semibold">옵션</div>
            <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
              <div className="flex gap-x-3 overflow-x-auto">
                {colorItem.sizeStocks.map((size, index) => (
                  <button
                    key={`option-${index}`}
                    className={
                      sizeIndex === index
                        ? "border-[1px] border-black p-1 text-sm"
                        : "border p-1 text-sm"
                    }
                    onClick={() => changeItem(index)}
                    disabled={size.stock === 0}
                  >
                    <div> {size.size}</div>
                    {size.stock === 0 && (
                      <div className="text-red-500">품절</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="font-semibold">수량</div>
            <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
              <div className="grid grid-cols-[1fr_4fr_1fr]">
                <button
                  className="border p-2"
                  onClick={() => {
                    minusOurderCount();
                  }}
                >
                  -
                </button>
                <button className="border p-2">{orderCount}</button>
                <button
                  className="border p-2"
                  onClick={() => {
                    plusOurderCount();
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between my-3">
            <div className="text-xl font-bold py-3">판매가</div>
            <div>
              <span className="text-4xl font-bold">
                {colorItem.discountedPrice
                  ? (colorItem.discountedPrice * orderCount).toLocaleString(
                      "ko-KR"
                    )
                  : (colorItem.price * orderCount).toLocaleString("ko-KR")}
              </span>
              원
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-1 xl:text-2xl">
            {/*<button className="border p-4">선물하기</button>*/}
            <button
              className="border p-4 bg-[#787878] text-[#fff]"
              onClick={() => putItemInShoppingBag()}
            >
              쇼핑백 담기
            </button>
            <button
              className="border p-4 bg-[#131922] text-[#fff]"
              onClick={orderItem}
            >
              바로 구매
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
