"use client"
import { Box, Container, Grid2, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="border-t-2">
        <div className="xl:mx-standard">
          <div className="flex justify-center gap-x-4">
            <Link href="/">
              <div>회사소개</div>
            </Link>
            <Link href="/">
              <div>이용약관</div>
            </Link>
            <Link href="/">
              <div>개인정보처리방침</div>
            </Link>
          </div>
          <div className="text-center">
            © 2016 SHINSEGAE INTERNATIONAL. ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>

      <nav className="xl:hidden border-t-2 py-2 sticky bottom-0 w-full bg-white text-xs flex justify-around gap-x-3">
        <Link href={"/"} className="">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-hamburger.png"
              alt="mypae"
              width={30}
              height={30}
            />
            <div className="">카테고리</div>
          </div>
        </Link>

        <Link href={"/"} className="">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-heart.png"
              alt="mypae"
              width={30}
              height={30}
            />
            <div className="">찜</div>
          </div>
        </Link>

        <Link href={"/"} className="">
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

        <Link href={"/"} className="">
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

        <Link href={"/"} className="">
          <div className="grid justify-items-center">
            <Image
              src="/icon/icon-most-recent.png"
              alt="recent"
              width={30}
              height={30}
            />
            <div className="">최근본상품</div>
          </div>
        </Link>
      </nav>
    </>
  );
}
