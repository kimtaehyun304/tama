"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoadingScreen from "@/components/LoadingScreen";
import MyPagination from "@/components/MyPagination";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";

const CATEGORYS: String[] = [
  "회원",
  "주문/결제",
  "배송",
  "취소/환불",
  "반품/교환",
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const pagePrams = Number(searchParams.get("page")) || 1;
  const categoryPrams = Number(searchParams.get("category")) || 0;
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(categoryPrams);
  const [faqPaging, setFaqPaging] = useState<FaqPagingType>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const router = useRouter();
  //아이템 개수
  const pageSize = 10;
  async function fetchFaq() {
    const params = new URLSearchParams();
    params.append("category", String(CATEGORYS[selectedCategoryIndex]));
    params.append("page", String(pagePrams));
    params.append("size", String(pageSize));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customer-support/faq?${params.toString()}`,
    );
    const faqPaging: FaqPagingType = await res.json();
    setFaqPaging(faqPaging);
  }

  useEffect(() => {
    fetchFaq();
  }, [selectedCategoryIndex, pagePrams]);

  //기본값 넣는 방벋도 있지만, 그러면 컴포넌트가 이동해서 어지러움
  if (!faqPaging) return <LoadingScreen />;

  return (
    <article className="mx-[5%] xl:mx-[10%]">
      <section>
        <div className="text-2xl font-bold text-center border-b-2 border-black py-5">
          고객센터
        </div>
      </section>

      {/* 카테고리 */}
      <section>
        <div className="py-[2%] flex flex-wrap">
          {CATEGORYS.map((category, index) => {
            return (
              <button
                key={index}
                className={`border p-3  ${
                  selectedCategoryIndex === index
                    ? "bg-black text-white border-black"
                    : "bg-white"
                }`}
                onClick={() => {
                  setSelectedCategoryIndex(index);
                  router.push(`?page=1`);
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        {faqPaging?.content.map((faq, index) => (
          <div key={index} className="border-b py-4">
            <button
              className="w-full text-left text-lg flex justify-between"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>Q. {faq.question}</span>
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>

            {openIndex === index && (
              <div className="mt-3 text-gray-600 whitespace-pre-wrap">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </section>

      <MyPagination
        pageCount={faqPaging.page.pageCount}
        pageRangeDisplayed={5}
      />
    </article>
  );
}
