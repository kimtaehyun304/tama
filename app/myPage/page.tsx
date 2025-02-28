"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import ItemRetrunGuide from "@/components/ItemReturnGuide";
import LoadingScreen from "@/components/LoadingScreen";
import LoginModal from "@/components/modal/LoginModal";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import MyPagination from "@/components/MyPagination";
import Review from "@/components/Review";
import ItemSlider from "@/components/slider/ItemSlider";
import StarRating from "@/components/StarRating";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useContext } from "react";
import ReactPaginate from "react-paginate";

const menuList = ["주문/배송 조회", "개인정보 수정"];

export default function Client() {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchCart() {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/member?id=${itemStocks.join()}`,
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
  }, [activeMenuIndex]);

  return (
    <article className="xl:mx-32 xl:my-[2%] flex gap-x-16">
      <aside className="hidden xl:block border p-4">
        <div className="font-bold text-3xl py-3">마이페이지</div>
        <ul className="">
          {menuList.map((menu, index) => (
            <li
              className={`p-1 cursor-pointer ${
                activeMenuIndex === index ? "font-bold" : ""
              }`} // 클릭된 메뉴에 font-bold 적용
              key={`menu${index}`}
              onClick={() => setActiveMenuIndex(index)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </aside>

      <section>
        <div className="text-center">{menuList[activeMenuIndex]}</div>
      </section>
    </article>
  );
}
