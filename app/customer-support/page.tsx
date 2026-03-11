"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from "react";

const CATEGORYS: String[] = [
  "회원",
  "주문/결제",
  "배송",
  "취소/환불",
  "반품/교환",
];

export default function ChatPage() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [faqPaging, setFaqPaging] = useState<FaqPagingType>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFaq() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customer-support/faq?category=${CATEGORYS[selectedCategoryIndex]}`,
      );
      const faqPaging: FaqPagingType = await res.json();
      setFaqPaging(faqPaging);
    }
    fetchFaq();
  }, [selectedCategoryIndex]);

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
              <span>Q. {faq.title}</span>
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>

            {openIndex === index && (
              <div className="mt-3 text-gray-600 whitespace-pre-wrap">{faq.description}</div>
            )}
          </div>
        ))}
      </section>
    </article>
  );
}
