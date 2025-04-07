"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoadingScreen from "@/components/LoadingScreen";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

// 사이즈 삭제 됐을때 예외처리 필요
export default function Cart() {
  const [isLoading, setIsLoading] = useState(true);

  // 로컬스트리지에서 가져옴. key: cartItem.colorItemSizeStockId, value: cartItem.orderCount
  const [cartMap, setCartMap] = useState<Map<number, number>>(new Map());
  const [itemTotalPrice, setItemTotalPrice] = useState<number>(0);
  const shippingFee = itemTotalPrice >= 40000 ? 0 : 3000;
  //fetch
  const [cartItems, setCartItems] = useState<StorageItemDetailType[]>([]);
  const simpleModalContext = useContext(SimpleModalContext);
  const [isOpenOutOfStockModal, setIsOpenOutOfStockModal] = useState(false);
  const [stock, setStock] = useState(0);
  const authContext = useContext(AuthContext);
  const loginModalContext = useContext(LoginModalContext);
  const NO_ITEM_MESSAGE = "장바구니에 담긴 상품이 없습니다";
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      const jsonStrCart = localStorage.getItem("tamaCart");
      if (jsonStrCart) {
        const parsedCart: StorageItemType[] = JSON.parse(jsonStrCart);
        const itemStocks: number[] = [];
        parsedCart?.forEach((item) => {
          itemStocks.push(item.colorItemSizeStockId);
        });

        if (itemStocks.length > 0) {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_SERVER_URL
            }/api/colorItemSizeStock?id=${itemStocks.join()}`,
            {
              cache: "no-store",
            }
          );

          const cartItemsJson = await res.json();
          if (!res.ok) {
            alert(cartItemsJson.message);
            return;
          }

          setCartItems(cartItemsJson);
        }
      }
      setIsLoading(false);
    }
    fetchCart();
    syncCartMap();
  }, []);

  //로컬스토리지와 동기화. 장바구니에서 뺴거나 수량 변경할 때 필요. 주문 가격 계산시 필요
  function syncCartMap() {
    const stringCart = localStorage.getItem("tamaCart");
    const parsedCart: StorageItemType[] = stringCart && JSON.parse(stringCart);
    const newCartMap = new Map();
    parsedCart?.forEach((cartItem) => {
      newCartMap?.set(cartItem.colorItemSizeStockId, cartItem.orderCount);
    });
    setCartMap(newCartMap);
  }

  //orderCount변경 또는 아이템 삭제하면 트리거
  //fetchCartItems 후에 실행되게 의존성 배열 cartItems 추가.
  //fetch전에 실행되서 찜찜하지만 문제없음
  useEffect(() => {
    setItemTotalPrice(
      cartItems.reduce(
        (total, cartItem) =>
          total +
          (cartItem.discountedPrice ?? cartItem.price) *
            (cartMap.get(cartItem.sizeStock.id) ?? 0),
        0
      )
    );
  }, [cartMap, cartItems]);

  function plusOurderCount(itemStock: ColorItemSizeStockType) {
    const orderCount = cartMap.get(itemStock.id);
    setStock(itemStock.stock);
    if (!orderCount) {
      simpleModalContext?.setIsOpenSimpleModal(true);
      simpleModalContext?.setMessage("orderCount 에러가 발생했습니다");
      return;
    }

    if (itemStock.stock <= orderCount) {
      setIsOpenOutOfStockModal(true);
      return;
    }

    const stringCart = localStorage.getItem("tamaCart");
    const parsedCart: StorageItemType[] = stringCart
      ? JSON.parse(stringCart)
      : null;

    const foundIndex = parsedCart.findIndex(
      (cartItem) => cartItem.colorItemSizeStockId === itemStock.id
    );
    ++parsedCart[foundIndex].orderCount;
    localStorage.setItem("tamaCart", JSON.stringify(parsedCart));
    syncCartMap();
  }

  function minusOurderCount(itemStock: ColorItemSizeStockType) {
    const orderCount = cartMap.get(itemStock.id);
    setStock(itemStock.stock);
    if (!orderCount) {
      simpleModalContext?.setIsOpenSimpleModal(true);
      simpleModalContext?.setMessage("orderCount 에러가 발생했습니다");
      return;
    }

    const stringCart = localStorage.getItem("tamaCart");
    const parsedCart: StorageItemType[] = stringCart
      ? JSON.parse(stringCart)
      : null;

    if (orderCount > 1) {
      const foundIndex = parsedCart.findIndex(
        (cartItem) => cartItem.colorItemSizeStockId === itemStock.id
      );
      --parsedCart[foundIndex].orderCount;
      localStorage.setItem("tamaCart", JSON.stringify(parsedCart));
      syncCartMap();
    }
  }

  function deleteCartItem(itemStock: ColorItemSizeStockType) {
    const stringCart = localStorage.getItem("tamaCart");
    const parsedCart: StorageItemType[] = stringCart
      ? JSON.parse(stringCart)
      : null;

    const localStorageCartItemIndex = parsedCart.findIndex(
      (localStorageCartItem) =>
        localStorageCartItem.colorItemSizeStockId === itemStock.id
    );

    if (localStorageCartItemIndex !== -1) {
      parsedCart.splice(localStorageCartItemIndex, 1);
      localStorage.setItem("tamaCart", JSON.stringify(parsedCart));
      syncCartMap();
    }

    const cartItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.sizeStock.id === itemStock.id
    );

    if (cartItemIndex !== -1) {
      cartItems.splice(cartItemIndex, 1);
      setCartItems([...cartItems]);
    }
  }

  //주문하기 (일괄 구매)
  function orderItems() {
    if (cartItems.some((item) => item.sizeStock.stock === 0)) {
      simpleModalContext?.setMessage("품절 상품을 제외해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    if (
      cartItems.some(
        (item) => item.sizeStock.stock < cartMap.get(item.sizeStock.id)!
      )
    ) {
      simpleModalContext?.setMessage(`재고가 부족합니다.`);
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    const tamaCart = localStorage.getItem("tamaCart");
    if (tamaCart) localStorage.setItem("tamaOrder", tamaCart);

    router.push("/order?inCart=true");
  }

  //바로구매 (단품 구매)
  function orderItem(itemSizeStockId: number) {
    const item = cartItems.find(
      (item) => item.sizeStock.id === itemSizeStockId
    );

    if (!item) {
      alert("에러 발생");
      return;
    }

    //재고 부족하면 바로 구매 버튼 안보이게 해놨지만, 혹시 몰라서 해놈
    if (item.sizeStock.stock! < cartMap.get(itemSizeStockId)!) {
      simpleModalContext?.setMessage("재고가 부족합니다");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    const stringCart = localStorage.getItem("tamaCart");

    let tamaCart: StorageItemType[] = [];
    if (stringCart) tamaCart = JSON.parse(stringCart);

    const storageItem = tamaCart.find(
      (item) => item.colorItemSizeStockId === itemSizeStockId
    );

    localStorage.setItem("tamaOrder", JSON.stringify(Array.of(storageItem)));
    router.push("/order?inCart=true");
  }

  return (
    <>
      <article>
        <OutOfStockModal
          stock={stock}
          isOpenOutOfStockModal={isOpenOutOfStockModal}
          setIsOpenOutOfStockModal={setIsOpenOutOfStockModal}
        />
        <article className="mx-[5%] xl:mx-[10%]">
          <section>
            <div className="text-2xl font-bold text-center border-b-2 border-black py-5">
              쇼핑백
            </div>
            {!authContext?.isLogined && (
              <div className="text-center bg-[#f8f8f8] py-6">
                <span
                  className="font-semibold underline cursor-pointer"
                  onClick={() => loginModalContext?.setIsOpenLoginModal(true)}
                >
                  로그인
                </span>
                하시면, 더 많은 혜택을 받으실 수 있습니다.
              </div>
            )}
          </section>
          {isLoading ? (
            <LoadingScreen />
          ) : cartItems.length === 0 ? (
            <div className="text-center p-3">{NO_ITEM_MESSAGE}</div>
          ) : (
            <>
              <section className="py-3 underline text-[#787878] cursor-pointer">
                품절상품 삭제
              </section>
              <section className="flex flex-col xl:grid xl:grid-cols-2 gap-3">
                {cartItems.map((item, index) => (
                  <div
                    className="border flex gap-x-3 p-2"
                    key={`item-${index}`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_S3_URL}/${item.uploadFile.storedFileName}`}
                      alt={item.name}
                      width={100}
                      height={100}
                    />
                    <div className="flex flex-col gap-y-2 flex-1">
                      <div>
                        <div>
                          {item.sizeStock.stock === 0 ? (
                            <span className="text-red-500">품절</span>
                          ) : (
                            <span className="text-gray-400">
                              남은 재고 {item.sizeStock.stock}
                            </span>
                          )}
                        </div>
                        <div className="text-red-500 font-bold">
                          {item.sizeStock.stock != 0 &&
                            item.sizeStock.stock <
                              cartMap.get(item.sizeStock.id)! &&
                            "재고가 부족합니다"}
                        </div>

                        <div>{item.name}</div>
                        <div>
                          {item.color}/{item.sizeStock.size}
                        </div>
                      </div>
                      <div className="text-sm text-[#aaa]">
                        {item.discountedPrice &&
                          `${(
                            item.price * cartMap.get(item.sizeStock.id)!
                          ).toLocaleString("ko-kr")}원`}
                      </div>
                      <div className="text-2xl font-semibold">
                        {item.discountedPrice
                          ? `${(
                              item.discountedPrice *
                              cartMap.get(item.sizeStock.id)!
                            ).toLocaleString("ko-kr")}원`
                          : `${(
                              item.price * cartMap.get(item.sizeStock.id)!
                            ).toLocaleString("ko-kr")}원`}
                      </div>
                      <div className="flex">
                        <button
                          className="border p-2"
                          onClick={() => {
                            minusOurderCount(item.sizeStock);
                          }}
                        >
                          -
                        </button>
                        <button className="border p-2 flex-1">
                          {cartMap.get(item.sizeStock.id)}
                        </button>
                        <button
                          className="border p-2"
                          onClick={() => {
                            plusOurderCount(item.sizeStock);
                          }}
                        >
                          +
                        </button>
                      </div>
                      {item.sizeStock.stock >=
                        cartMap.get(item.sizeStock.id)! && (
                        <button
                          className="border p-2"
                          onClick={() => {
                            orderItem(item.sizeStock.id);
                          }}
                        >
                          바로 구매
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          deleteCartItem(item.sizeStock);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="black"
                          strokeWidth={1}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="6" y1="18" x2="18" y2="6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </section>
              <section className="text-center m-4">
                <div className="bg-[#f5f5f5] inline-block p-4 space-y-3">
                  <div className="flex justify-center gap-x-20">
                    <span className="grow">상품금액</span>
                    <span className="grow">
                      {itemTotalPrice.toLocaleString("ko-KR")}원
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span className="">배송비</span>
                    <span className="grow text-right">
                      {shippingFee.toLocaleString("ko-KR")}원
                    </span>
                  </div>
                  <hr />
                  <div className="flex font-semibold text-xl">
                    <span>총</span>
                    <span className="grow text-right">
                      {(itemTotalPrice + shippingFee).toLocaleString("ko-KR")}
                    </span>
                    원
                  </div>
                  <div>
                    <button
                      className="bg-[#131922] text-[#fff] border p-4 w-full"
                      onClick={orderItems}
                    >
                      주문하기
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </article>
      </article>
    </>
  );
}
