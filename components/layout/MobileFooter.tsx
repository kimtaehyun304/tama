"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CategoryModal from "../modal/CategoryModal";

export default function () {
  const [isOpenCategoryModal, setIsOpenCategoryModal] =
    useState<boolean>(false);
  return (
    <>
      <nav className="xl:hidden border-t-2 py-2 sticky bottom-0 w-full bg-white text-xs flex  gap-x-3">
        <div
          onClick={() => setIsOpenCategoryModal(true)}
          className="flex-1 grid justify-items-center"
        >
          <Image
            src="/icon/icon-hamburger.png"
            alt="mypae"
            width={30}
            height={30}
          />
          <div className="">카테고리</div>
        </div>

        <div className="flex-1">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-heart.png"
              alt="mypae"
              width={30}
              height={30}
            />
            <div className="">찜</div>
          </div>
        </div>

        <Link href={"/"} className="flex-1">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-home.png"
              alt="mypae"
              width={30}
              height={30}
            />
            <div className="">홈</div>
          </div>
        </Link>

        <Link href={"/myPage/order"} className="flex-1">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-person.png"
              alt="mypae"
              width={30}
              height={30}
            />
            <div className="">마이페이지</div>
          </div>
        </Link>

        <div className="flex-1">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-most-recent.png"
              alt="recent"
              width={30}
              height={30}
            />
            <div className="">최근본상품</div>
          </div>
        </div>
      </nav>
      <CategoryModal
        isOpenModal={isOpenCategoryModal}
        setIsOpenModal={setIsOpenCategoryModal}
      />
    </>
  );
}
