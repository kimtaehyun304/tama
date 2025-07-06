"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const menus = ["주문/배송 조회", "회원정보 수정", "배송지 관리"];
//const menuList = ["주문/배송 조회", "개인정보/배송지 수정", "포인트", "쿠폰"];

//const linkMap = new Map<string, string>();
const menuMap = new Map<string, string>();
menuMap.set("주문/배송 조회", "order");
menuMap.set("회원정보 수정", "information");
menuMap.set("배송지 관리", "address");

export default () => {
  const path = usePathname();
  const segments = path.split("/");
  const currentMenu = segments[2];

  return (
    <aside className="border p-4 go">
      <div className="font-bold text-3xl py-3">마이페이지</div>
      <ul className="">
        {menus.map((menu, index) => (
          <Link href={`/myPage/${menuMap.get(menu)!}`} key={`menu-${index}`}>
            <li
              className={`p-1 cursor-pointer ${
                currentMenu === menuMap.get(menu) ? "font-bold" : ""
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
