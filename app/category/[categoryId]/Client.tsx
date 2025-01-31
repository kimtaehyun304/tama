"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import ItemRetrunGuide from "@/components/ItemReturnGuide";
import LoadingScreen from "@/components/LoadingScreen";
import LoginModal from "@/components/modal/LoginModal";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import MyPagination from "@/components/MyPagination";
import PaginatedItems from "@/components/PaginatedItems";
import Review from "@/components/Review";
import ItemSlider from "@/components/slider/ItemSlider";
import StarRating from "@/components/StarRating";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useContext } from "react";
import ReactPaginate from "react-paginate";

type Props = {
  categories: CateogoryType[];
  colors: ColorType[];
};

export default function Client({ categories, colors }: Props) {
  const params = useParams<{ categoryId: string }>();
  const categoryId = parseInt(params.categoryId);
  const [categoryItems, setCategoryItems] = useState<CategoryItemType>();
  const searchParams = useSearchParams();
  const pagePrams = Number(searchParams.get("page")) || 1;
  const pageSize = 1;
  const [selectedIndex, setSelectedIndex] = useState<number[]>(
    Array(pageSize).fill(0)
  );
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();

  useEffect(() => {
    async function fetchCategoryItems() {
      const categoryItemRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items?categoryId=${categoryId}&page=${pagePrams}&size=${pageSize}`,
        {
          cache: "no-store",
        }
      );

      if (!categoryItemRes.ok) {
        return categoryItemRes;
      }

      setCategoryItems(await categoryItemRes.json());
    }
    fetchCategoryItems();
  }, [pagePrams]);

  useEffect(() => {
    async function fetchMinMaxPrice() {
      const priceRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/min-max-price?categoryId=${categoryId}`,
        {
          cache: "no-store",
        }
      );

      if (!priceRes.ok) {
        return priceRes;
      }

      const prices: MinMaxPrice = await priceRes.json();
      setMinPrice(prices.minPrice);
      setMaxPrice(prices.maxPrice);
    }
    fetchMinMaxPrice();
  }, []);

  //loading.tsx때문에 자동으로 뜨지만, 생략하면 categoryItems' is possibly 'undefined'.ts(18048) 에러 생김
  if (!categoryItems) {
    return <LoadingScreen />;
  }

  return (
    <article className="xl:mx-32 xl:my-[2%] flex gap-x-16">
      {/* 카테고리, 검색 필터*/}
      <aside>
        <section>
          {categories.map((category, index) => (
            <ul className="py-1" key={`category${index}`}>
              <li
                className={
                  category.id === categoryId ? "font-nanumGothicBold " : ""
                }
              >
                <Link href={`/category/${category.id}`}>{category.name}</Link>
              </li>
              <ul className="bg-[#f8f8f8] py-2">
                {category.children.map((child, categoryChildindex) => (
                  <li
                    className={`indent-4 py-2 text-sm ${
                      child.id === categoryId ? "font-bold" : ""
                    }`}
                    key={`categorychild${categoryChildindex}`}
                  >
                    <Link href={`/category/${child.id}`}>{child.name}</Link>
                  </li>
                ))}
              </ul>
            </ul>
          ))}
        </section>
        <section className="space-y-4">
          <div className="font-bold">필터</div>
          <section className="space-y-2">
            <div>가격</div>
            <div>
              <label htmlFor="priceMin">최소</label>
              <input
                type="text"
                id="priceMin"
                className="ml-2 border focus:outline-none text-right p-1"
                placeholder={`${minPrice} 이상`}
                value={minPrice}
                onChange={() => {}}
              />
            </div>
            <div>
              <label htmlFor="priceMax">최대</label>
              <input
                type="text"
                id="priceMax"
                className="ml-2 border focus:outline-none text-right p-1"
                placeholder={`${maxPrice} 이하`}
                value={maxPrice}
                onChange={() => {}}
              />
            </div>
          </section>
          <section className="space-y-2">
            <div>색상 계열</div>
            <div className="grid grid-cols-2">
              {colors.map((color, index) => (
                <div className="flex gap-x-1" key={`color${index}`}>
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px]"
                    id={`color${index}`}
                  />
                  <label htmlFor={`color${index}`}>
                    <div
                      style={{ backgroundColor: color.hexCode }}
                      className={`w-[18px] h-[18px] inline-block border`}
                    ></div>
                  </label>
                  <label htmlFor={`color${index}`}>{color.name}</label>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <div>기타</div>
            <div className="">
              <input type="checkbox" id="man" />
              <label htmlFor="man">남성</label>
            </div>
            <div>
              <input type="checkbox" id="woman" />
              <label htmlFor="woman">여성</label>
            </div>
            <div>
              <input type="checkbox" id="soldout" />
              <label htmlFor="soldout">품절포함</label>
            </div>
          </section>
        </section>

        <button className="border p-3 w-full">적용</button>
      </aside>
      <section className="grow space-x-5">
        <ul>
          {categoryItems.content.map((item, categoryItemindex) => (
            <li key={`color-items${categoryItemindex}`}>
              <div className="inline-block">
                <Link
                  href={`/color-items/${
                    item.relatedColorItems[selectedIndex[categoryItemindex]]
                      .colorItemId
                  }`}
                >
                  <Image
                    src={
                      item.relatedColorItems[selectedIndex[categoryItemindex]]
                        .imageSrc
                    }
                    width={250}
                    height={250}
                    alt={item.name}
                  />
                  <div>{item.name}</div>
                  <div className="flex gap-x-1">
                    {item.discountedPrice && (
                      <span className="font-semibold text-[#d99c63]">
                        {100 -
                          Math.round((item.discountedPrice / item.price) * 100)}
                        %
                      </span>
                    )}
                    {item.discountedPrice || item.price}
                  </div>
                </Link>
                <div className="flex gap-x-1">
                  {item.relatedColorItems.map((related, relatdIndex) => (
                    <div
                      style={{ backgroundColor: related.hexCode }}
                      className={`w-[20px] h-[20px] inline-block border cursor-pointer ${
                        relatdIndex === selectedIndex[categoryItemindex]
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      data-tooltip={related.color}
                      key={`relatdColrItem${relatdIndex}`}
                      onClick={() => {
                        let newArr = [...selectedIndex];
                        newArr[categoryItemindex] = relatdIndex;
                        setSelectedIndex(newArr);
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <MyPagination
          pageCount={categoryItems.page.pageCount}
          pageRangeDisplayed={5}
        />
      </section>
    </article>
  );
}
