import Image from "next/image";
import Link from "next/link";
import LoginButton from "./LoginButton";
import MyError from "../MyError";
import MenuNav from "./MenuNav";
import MyPageButton from "./MyPageButton";

export default async function Header() {

  return (
    <header className="sticky top-0 z-10 bg-white">
      <nav className="hidden xl:block border-b">
        <div className="xl:mx-standard">
          <div className="flex justify-end gap-x-4 text-sm py-3">
            <LoginButton />
            <Link href={"/"} className="">
              <div className="">고객센터</div>
            </Link>
          </div>

          <div className="flex justify-between items-center text-sm pb-4">
            <div className="flex justify-center gap-x-10">
              <Link href={"/"} className="">
                <div className="font-nanumGothicBold text-4xl">TAMA</div>
              </Link>

              <div className="flex border rounded-full bg-[#F9F9F9] px-4 py-1">
                <input
                  className="bg-transparent pr-40 focus:outline-none"
                  placeholder="검색어를 입력하세요"
                />
                <button className="">
                  <Image
                    src="/icon/icon-search.png"
                    alt="search"
                    width={30}
                    height={30}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-x-3">
              <MyPageButton />

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

              <Link href={"/cart"} className="">
                <div className="grid justify-items-center">
                  <Image
                    src="/icon/icon-shopping-bag.png"
                    alt="shopping-bag"
                    width={30}
                    height={30}
                  />
                  <div className="">쇼핑백</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <nav className="xl:hidden border-b">
        <div className="flex justify-between items-center text-sm p-4">
          <Link href={"/"} className="">
            <div className="font-extrabold text-4xl">TAMA</div>
          </Link>
          <div className="flex gap-x-4">
            <button className="">
              <Image
                src="/icon/icon-search.png"
                alt="search"
                width={30}
                height={30}
              />
            </button>
            <Link href={"/cart"} className="">
              <div className="">
                <Image
                  src="/icon/icon-shopping-bag.png"
                  alt="shopping-bag"
                  width={30}
                  height={30}
                />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <MenuNav />
    </header>
  );
}
