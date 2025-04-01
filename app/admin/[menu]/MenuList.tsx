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
import { AuthContext } from "@/components/context/AuthContext";
import { LoginModalContext } from "@/components/context/LoginModalContext";

const menus = ["주문/배송 조회", "상품 등록"];
//const menuList = ["주문/배송 조회", "개인정보/배송지 수정", "포인트", "쿠폰"];

//const linkMap = new Map<string, string>();
const menuMap = new Map<string, string>();
menuMap.set("주문/배송 조회", "order");
menuMap.set("상품 등록", "item");

export default () => {
  //const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  //const [activeMenu, setActiveMenu] = useState<string>(menus[0]);
  const params = useParams<{ menu: string }>();
  const paramsMenu = params.menu;
  return (
    <aside className=" border p-4">
      <div className="font-bold text-3xl py-3">관리자 페이지</div>
      <ul className="">
        {menus.map((menu, index) => (
          <Link href={`/admin/${menuMap.get(menu)!}`} key={`menu-${index}`}>
            <li
              className={`p-1 cursor-pointer ${
                paramsMenu === menuMap.get(menu) ? "font-bold" : ""
              }`} // 클릭된 메뉴에 font-bold 적용
            >
              {menu}
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
};
