"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from "react";

export default function ChatPage() {
  return (
    <article className="flex flex-col h-[70vh] bg-gray-50 xl:mx-standard">
      <section className="flex gap-x-10 m-auto ">
        <Link href={"/chatbot/recommend"}>
          <div className="border inline-block text-center">
            <img src="/icon/icon-like.png" />
            상품 추천 챗봇
          </div>
        </Link>

        <Link href={"/chatbot/faq"}>
          <div className="border inline-block text-center">
            <img src="/icon/icon-faq.png" />
            상담 챗봇
          </div>
        </Link>
      </section>
    </article>
  );
}
