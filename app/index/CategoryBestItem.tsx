"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();
  const [categoryBestItems, setCategoryBestItems] =
    useState<CategoryBestItemType[]>();
  const [parentCategories, setParentCategories] = useState<BaseCateogoryType[]>(
    [],
  );

  useEffect(() => {
    async function fetchParentCategory() {
      const parentCategoryRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category/parent`,
        {
          cache: "no-store",
        },
      );

      const parentCategoryJson = await parentCategoryRes.json();
      if (!parentCategoryRes.ok) {
        alert(parentCategoryJson.message);
        return;
      }

      setParentCategories(parentCategoryJson);
    }
    fetchParentCategory();

    fetchCategoryBestItem(selectedCategoryId);
  }, [selectedCategoryId]);

  async function fetchCategoryBestItem(categoryId: number | undefined) {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", String(categoryId));
    params.append("page", String(1));
    params.append("size", String(10));

    const categoryBestItemRes = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }/api/items/best?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    const categoryBestItems = await categoryBestItemRes.json();
    if (!categoryBestItemRes.ok) {
      alert(categoryBestItems.message);
      return;
    }
    setCategoryBestItems(categoryBestItems);
  }

  return (
    <section className="xl:block my-16">
      <nav className="flex justify-between items-end border-b pb-6 px-3 xl:px-0 text">
        <div className="flex justify-start items-end gap-x-4">
          <span className="font-extrabold text-3xl">카테고리 베스트</span>
          <span className="">전일 주문 순위입니다</span>
        </div>
        <Link href={"/category/0/item"} className="text-end text-[#777]">
          더보기 &#10095;
        </Link>
      </nav>

      <nav className="">
        <div className="flex gap-x-2 text-sm justify-center xl:justify-start py-4">
          <button
            onClick={() => {
              setSelectedCategoryId(0);
            }}
            className="grid justify-items-center"
          >
            <Image
              className={`border p-1 rounded-lg bg-gray-200 ${
                selectedCategoryId == 0 && `border-black`
              }`}
              src="/icon/icon-hamburger.png"
              alt="전체"
              width={60}
              height={60}
            />
            <span className="">전체</span>
          </button>

          {parentCategories.map((parentCategory, index) => (
            <button
              onClick={() => {
                setSelectedCategoryId(parentCategory.id);
              }}
              className="grid justify-items-center"
              key={`parentCategory${index}`}
            >
              <Image
                className={`border p-1 rounded-lg bg-gray-200 ${
                  selectedCategoryId == parentCategory.id && `border-black`
                }`}
                src={`/icon/icon-${parentCategory.name}.png`}
                alt={parentCategory.name}
                width={60}
                height={60}
              />
              <span className="">{parentCategory.name}</span>
            </button>
          ))}
        </div>

        <div className="px-1 sm:px-0 gap-x-1 sm:gap-x-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 xl:gap-6">
          {categoryBestItems?.map((item, index) => (
            <Link
              href={`/color-items/${item.colorItemId}`}
              key={`categoryBestimages-${index}`}
            >
              <ul className="positon: relative">
                <li>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${item.uploadFile.storedFileName}`}
                    alt={item.name}
                    width={232}
                    height={232}
                  />
                  <div className="absolute top-2 left-2 bg-[#ffffff] p-1">
                    {index + 1}위
                  </div>
                  <div className="">
                    <div className="py-1">{item.name}</div>
                    <div className="flex items-center gap-x-2 py-1">
                      <span>
                        <span className="font-semibold">
                          {item.discountedPrice
                            ? item.discountedPrice.toLocaleString("ko-KR")
                            : item.price.toLocaleString("ko-KR")}
                        </span>
                        원
                      </span>
                      <span className="text-sm text-[#aaa]">
                        {item.discountedPrice &&
                          `${item.price.toLocaleString("ko-KR")}원`}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1 text-sm text-[#aaa]">
                      <Image
                        src="/icon/icon-star.png"
                        alt={item.name}
                        width={16}
                        height={16}
                      />
                      {item.avgRating}
                      <span>({item.reviewCount})</span>
                    </div>
                  </div>
                </li>
              </ul>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
};
