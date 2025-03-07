"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  categories: CateogoryType[];
};

export default ({ categories }: Props) => {

  const params = useParams<{ categoryId: string }>();
  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(false)
  }, [params.categoryId]);

  return (
    <section>
      <nav className="border-b">
        <div className="xl:mx-standard">
          <div className="flex items-center gap-x-4 py-1">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="hidden xl:block"
            >
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
            <Link href={"/"} className="">
              <div className="px-4 xl:px-0">홈</div>
            </Link>
            <Link href={"/"} className="">
              <div className="">베스트</div>
            </Link>
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
                  <Link href={`/category/${category.id}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
            <ul className="grow">
              {categories[categoryIndex].children.map((category, index) => (
                <li
                  className="px-8 py-3 hover:text-[#ff5432] hover:font-bold bg-[#ffffff]"
                  key={`category${index}`}
                >
                  <Link href={`/category/${category.id}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
