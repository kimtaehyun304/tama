"use client";

import ItemRetrunGuide from "@/components/ItemReturnGuide";
import { useParams,  useSearchParams } from "next/navigation";
import {  useEffect, useRef, useState } from "react";
import ItemSliderReviews from "../ItemSliderReviews";
import ItemSummary from "../ItemSummary";
import ItemReview from "../ItemReview";
import ItemDetail from "../ItemDetail";

type Props = {
  colorItem: ColorItemType;
};

const defaultReview: ReviewType = {
  avgRating: 0,
  content: [],
  page: {
    page: 1,
    size: 10,
    pageCount: 1,
    rowCount: 1,
  },
};

export default function Client({ colorItem }: Props) {
  const itemDetailRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const itemReturnGuideRef = useRef<HTMLDivElement>(null);

  const params = useParams<{ colorItemId: string }>();
  const colorItemId = parseInt(params.colorItemId);
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<ReviewType>(defaultReview);
  const pagePrams = Number(searchParams.get("page")) || 1;
  //기본값 최신순
  const [sortProperty, setSortProperty] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  //sortProperty,sortDirection로 분류한 sort 이름
  const [sort, setSort] = useState<string>("최신순");

  //아이템 개수
  const pageSize = 10;
  const [activeSection, setActiveSection] = useState<string>("상품상세정보");

  function handleNavClick(section: string) {
    setActiveSection(section);

    switch (activeSection) {
      case "상품상세정보":
        itemDetailRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "리뷰":
        reviewRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "배송/상품/교환안내":
        itemReturnGuideRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
    }
  }

  async function fetchReviews() {
    const params = new URLSearchParams();
    params.append("colorItemId", String(colorItemId));
    params.append("page", String(pagePrams));
    params.append("size", String(pageSize));
    params.append("sort", `${sortProperty},${sortDirection}`);

    const reviewsRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews?${params.toString()}`
    );
    const reivews = await reviewsRes.json();
    if (!reviewsRes.ok) {
      alert(reivews.message);
      return;
    }

    setReviews(reivews);
  }

  useEffect(() => {
    fetchReviews();
  }, [pagePrams, sortProperty, sortDirection]);

  useEffect(() => {
    function switchSort() {
      const value = `${sortProperty},${sortDirection}`;
      switch (value) {
        case "createdAt,desc":
          setSort("최신순");
          break;
        case "createdAt,asc":
          setSort("오래된순");
          break;
      }
    }
    switchSort();
  }, [sortProperty, sortDirection]);

  return (
    <article className="xl:mx-standard xl:my-[2%]">
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-x-20 mx-[2%] ">
        {/*(좌) 상품 이미지 및 리뷰 */}
        <ItemSliderReviews
          colorItem={colorItem}
          reviews={reviews}
          handleNavClick={handleNavClick}
        />
        {/*(우) 상품 설명 및 구매  */}
        <ItemSummary colorItem={colorItem} />
      </section>

      <section>
        <nav className="text-xl grid grid-cols-3 justify-stretch p-3">
          <button
            className={`border-b pb-4 ${
              activeSection === "상품상세정보" ? "border-black font-bold" : ""
            }`}
            onClick={() => handleNavClick("상품상세정보")}
          >
            상품상세정보
          </button>
          <button
            className={`border-b pb-4 ${
              activeSection === "리뷰" ? "border-black font-bold" : ""
            }`}
            onClick={() => handleNavClick("리뷰")}
          >
            리뷰({reviews.page.rowCount})
          </button>
          <button
            className={`border-b pb-4 ${
              activeSection === "배송/상품/교환안내"
                ? "border-black font-bold"
                : ""
            }`}
            onClick={() => handleNavClick("배송/상품/교환안내")}
          >
            배송/상품/교환안내
          </button>
        </nav>

        <ItemDetail
          colorItem={colorItem}
          itemDetailRef={itemDetailRef}
          activeSection={activeSection}
        />

        <ItemReview
          reviewRef={reviewRef}
          activeSection={activeSection}
          reviews={reviews}
          sort={sort}
          setSortProperty={setSortProperty}
          setSortDirection={setSortDirection}
        />

        {/* 배송/상품/교환안내 */}
        <div
          ref={itemReturnGuideRef}
          className="p-2"
          hidden={activeSection !== "배송/상품/교환안내"}
        >
          <ItemRetrunGuide />
        </div>
      </section>
      
    </article>
  );
}
