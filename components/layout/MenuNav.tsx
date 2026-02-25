"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";

export default () => {
  const params = useParams<{ categoryId: string }>();
  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<FamilyCateogoryType[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
        {
          cache: "no-store",
        },
      );
      const categoriesRes = await res.json();

      if (!res.ok) {
        alert(categoriesRes.message);
        return;
      }

      setCategories(categoriesRes);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsVisible(false);
  }, [params.categoryId]);

  return (
    <section>
      <nav className="border-b">
        <div className="xl:mx-standard">
          <div className="flex items-center divide-x border-x divide-gray-300">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="hidden xl:flex items-center gap-2 px-5 py-3"
            >
              <Image
                src="/icon/icon-hamburger.png"
                alt="mypae"
                width={30}
                height={30}
              />
              <span>전체 카테고리</span>
            </button>

            <Link href={"/"} className="px-5 py-3">
              홈
            </Link>

            <Link href={"/recommend"} className="px-5 py-3">
              추천
            </Link>

            <div className="xl:hidden px-5 py-3">
              <LoginButton />
            </div>

            <div className="xl:hidden px-5 py-3">고객센터</div>
          </div>
        </div>
      </nav>

      {/*하위 카테고리 수에 따라 height가 바뀌길래 제일 긴걸로 고정 */}
      {isVisible && (
        <div className="xl:mx-standard border-r border-b h-[240px]">
          <div className="flex">
            <ul className="bg-[#F5F5F5]">
              {categories.map((category, index) => (
                <li
                  className={`px-16 py-3 ${
                    categoryIndex === index
                      ? "text-[#ff5432] font-bold bg-[#ffffff]"
                      : ""
                  }`}
                  key={`category${index}`}
                  onMouseOver={() => setCategoryIndex(index)}
                >
                  <Link href={`/category/${category.id}/item`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="grow">
              {categories[categoryIndex].children.map((category, index) => (
                <li
                  className="px-8 py-3 hover:text-[#ff5432] hover:font-bold bg-[#ffffff]"
                  key={`category${index}`}
                >
                  <Link href={`/category/${category.id}/item`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
