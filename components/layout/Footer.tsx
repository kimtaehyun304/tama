import { Box, Container, Grid2, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import CategoryModal from "../modal/CategoryModal";
import MobileFooter from "./MobileFooter";

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

      <MobileFooter />
    </>
  );
}
