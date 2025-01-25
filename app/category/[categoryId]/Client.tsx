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
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useContext } from "react";

type Props = {
  categories: CateogoryType[];
  categoryItems: CategoryItemType;
  colors: ColorType[];
};

export default function Client({ categories, categoryItems, colors }: Props) {
  const params = useParams<{ categoryId: string }>();
  const categoryId = parseInt(params.categoryId);
  return (
    <article className="xl:mx-32 xl:my-[2%] flex gap-x-16">
      {/*검색 필터*/}
      <aside>
        <section>
          {categories.map((category, index) => (
            <ul className="py-1" key={`category${index}`}>
              <li className={category.id === categoryId ? "font-bold" : ""}>
                <Link href={`/category/${category.id}`}>{category.name}</Link>
              </li>
              <ul className="bg-[#f8f8f8]">
                {category.children.map((child, index) => (
                  <li
                    className={`indent-4 py-1 text-sm ${
                      child.id === categoryId ? "font-bold" : ""
                    }`}
                    key={`child${index}`}
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
                className="ml-2 border focus:outline-none"
                placeholder="10000"
              />
            </div>
            <div>
              <label htmlFor="priceMax">최대</label>
              <input
                type="text"
                id="priceMax"
                className="ml-2 border focus:outline-none"
                placeholder="100000"
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
        {categoryItems.content.map((item, index) => (
          <div key={`item${index}`} className="inline-block">
            <Image
              src={item.relatedColorItems[0].imageSrc}
              width={250}
              height={250}
              alt={item.name}
            />
            <div>{item.name}</div>
            <div className="flex gap-x-1">
              {item.discountedPrice && (
                <span className="font-semibold  text-[#d99c63]">
                  {100 - Math.round((item.discountedPrice / item.price) * 100)}%
                </span>
              )}
              {item.discountedPrice || item.price}
            </div>
            <div className="flex gap-x-1">
              {item.relatedColorItems.map((child, index) => (
                <div
                  style={{ backgroundColor: child.hexCode }}
                  className="w-[20px] h-[20px] inline-block border"
                  data-tooltip={child.color}
                  key={`child${index}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
        
      </section>
    </article>
  );
}
