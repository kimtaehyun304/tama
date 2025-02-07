"use client";

import CloseSvg from "@/components/CloseSvg";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoadingScreen from "@/components/LoadingScreen";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import BannerSlider from "@/components/slider/BannerSlider";
import { error } from "console";
import { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext, SetStateAction } from "react";

// 사이즈 삭제 됐을때 예외처리 필요
export default function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  // 로컬스트리지에서 가져옴
  const [cartMap, setCartMap] = useState<Map<number, number>>(new Map());
  const [itemTotalPrice, setItemTotalPrice] = useState<number>(0);
  const shippingFee = itemTotalPrice >= 40000 ? 0 : 3000;
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const simpleModalContext = useContext(SimpleModalContext);
  const [isOpenOutOfStockModal, setIsOpenOutOfStockModal] = useState(false);
  const [stock, setStock] = useState(0);
  // 로컬스토리지 동기화 state
  const [localStorageCartItems, setLocalStorageCartItems] = useState<
    LocalStorageCartItemType[]
  >([]);
  const [
    isInitializedLocalStorageCartItems,
    setIsInitializedLocalStorageCartItems,
  ] = useState(false);

  useEffect(() => {
    async function fetchCart() {
      const jsonStrCart = localStorage.getItem("tamaCart");
      if (jsonStrCart) {
        const jsonCart: LocalStorageCartItemType[] = JSON.parse(jsonStrCart);
        setLocalStorageCartItems(jsonCart);
        setIsInitializedLocalStorageCartItems(true);
        let itemStocks: number[] = [];
        jsonCart.forEach((json) => {
          itemStocks.push(json.itemStockId);
        });

        if (itemStocks.length > 0) {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_SERVER_URL
            }/api/itemStocks?id=${itemStocks.join()}`,
            {
              cache: "no-store",
            }
          );

          const cartItemsJson = await res.json();
          if (!res.ok) return cartItemsJson;
          setCartItems(cartItemsJson);
        }
      }
    }
    fetchCart();
  }, []);

  // 중복 실행되서 개선하고 싶음
  // 로컬 스트로지와 state 동기화
  useEffect(() => {
    //localStorageCartItems 채워지기 전에 실행되서 초기화 체크
    if (isInitializedLocalStorageCartItems) {
      localStorage.setItem("tamaCart", JSON.stringify(localStorageCartItems));
      const newCartMap = new Map(cartMap);
      localStorageCartItems.forEach((cartItem) => {
        setCartMap(newCartMap?.set(cartItem.itemStockId, cartItem.orderCount));
      });
    }
  }, [localStorageCartItems]);

  //orderCount변경 또는 아이템 삭제하면 트리거
  useEffect(() => {
    setItemTotalPrice(
      cartItems.reduce(
        (total, cartItem) =>
          total +
          (cartItem.discountedPrice ?? cartItem.price) *
            (cartMap.get(cartItem.stock.id) ?? 0),
        0
      )
    );
  }, [cartMap, cartItems]);

  function plusOurderCount(itemStock: ItemStockType) {
    const orderCount = cartMap.get(itemStock.id);
    setStock(itemStock.stock);
    if (!orderCount) {
      simpleModalContext?.setIsOpenSimpleModal(true);
      simpleModalContext?.setMessage("orderCount 에러가 발생했습니다");
      return;
    }

    if (itemStock.stock === orderCount) {
      setIsOpenOutOfStockModal(true);
      return;
    }

    if (itemStock.stock > orderCount) {
      const foundIndex = localStorageCartItems.findIndex(
        (cartItem) => cartItem.itemStockId === itemStock.id
      );
      ++localStorageCartItems[foundIndex].orderCount;
      setLocalStorageCartItems([...localStorageCartItems]);
    }
  }

  function minusOurderCount(itemStock: ItemStockType) {
    const orderCount = cartMap.get(itemStock.id);
    setStock(itemStock.stock);
    if (!orderCount) {
      simpleModalContext?.setIsOpenSimpleModal(true);
      simpleModalContext?.setMessage("orderCount 에러가 발생했습니다");
      return;
    }

    if (orderCount > 1) {
      const foundIndex = localStorageCartItems.findIndex(
        (cartItem) => cartItem.itemStockId === itemStock.id
      );
      --localStorageCartItems[foundIndex].orderCount;
      setLocalStorageCartItems([...localStorageCartItems]);
    }
  }

  function deleteCartItem(itemStock: ItemStockType) {
    const localStorageCartItemIndex = localStorageCartItems.findIndex(
      (localStorageCartItem) =>
        localStorageCartItem.itemStockId === itemStock.id
    );

    if (localStorageCartItemIndex !== -1) {
      localStorageCartItems.splice(localStorageCartItemIndex, 1);
      setLocalStorageCartItems([...localStorageCartItems]);
    }

    const cartItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.stock.id === itemStock.id
    );

    if (cartItemIndex !== -1) {
      cartItems.splice(cartItemIndex, 1);
      setCartItems([...cartItems]);
    }
  }

  //cartItems 빈 배열로 초기화 해놔서 검사 안필요
  //if (!cartItems) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>쇼핑백</title>
      </Head>
      <article>
        <OutOfStockModal
          stock={stock}
          isOpenOutOfStockModal={isOpenOutOfStockModal}
          setIsOpenOutOfStockModal={setIsOpenOutOfStockModal}
        />
        <article className="mx-[5%] xl:mx-[20%]">
          <section className="text-2xl font-bold text-center border-b-2 border-black py-5">
            쇼핑백
          </section>
          <section className="grid gap-y-4 gap-x-4 lg:grid-cols-2">
            {cartItems.map((item, index) => (
              <div className="border flex gap-x-6" key={`item-${index}`}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                />

                {/* 상품정보 */}
                <div className="space-y-1 flex-1">
                  <div className="text-red-500">
                    {item.stock.stock === 0 && "품절"}
                  </div>
                  <div>{item.name}</div>
                  <div>
                    {item.color}/{item.stock.size}
                  </div>

                  {/* 가격 및 주문수량 */}
                  <div className="text-sm text-[#aaa]">
                    {item.discountedPrice &&
                      `${item.price.toLocaleString("ko-KR")}원`}
                  </div>

                  <div className="text-2xl font-semibold">
                    {item.discountedPrice
                      ? item.discountedPrice.toLocaleString("ko-KR")
                      : item.price.toLocaleString("ko-KR")}
                    원
                  </div>

                  <div className="flex">
                    <button
                      className="border p-2 flex-1"
                      onClick={() => {
                        minusOurderCount(item.stock);
                      }}
                    >
                      -
                    </button>
                    <button className="border p-2 flex-1">
                      {cartMap.get(item.stock.id)}
                    </button>
                    <button
                      className="border p-2 flex-1"
                      onClick={() => {
                        plusOurderCount(item.stock);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col ">
                  <button
                    onClick={() => {
                      deleteCartItem(item.stock);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="black"
                      strokeWidth={2}
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
              <div className="flex font-semibold  text-xl">
                <span>총</span>
                <span className="grow text-right ">
                  {(itemTotalPrice + shippingFee).toLocaleString("ko-KR")}
                </span>
                원
              </div>
              <div>
                <button className="bg-[#131922] text-[#fff] border p-4 w-full">
                  주문하기
                </button>
              </div>
            </div>
          </section>
        </article>
      </article>
    </>
  );
}
