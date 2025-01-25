"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import ItemRetrunGuide from "@/components/ItemReturnGuide";
import LoadingScreen from "@/components/LoadingScreen";
import LoginModal from "@/components/modal/LoginModal";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import Review from "@/components/Review";
import ItemSlider from "@/components/slider/ItemSlider";
import StarRating from "@/components/StarRating";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";

type Props = {
  colorItem: ColorItemType;
};

export default () => {
  return (
    <button>
      <div className="border-x grid grid-flow-col items-center px-5">
        <Image
          src="/icon/icon-hamburger.png"
          alt="mypae"
          width={30}
          height={30}
        />
        <div className="py-2">전체 카테고리</div>
      </div>
    </button>
  );
};
