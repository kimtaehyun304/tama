import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  minPrice: number | undefined;
  setMinPrice: Dispatch<SetStateAction<number | undefined>>;
  maxPrice: number | undefined;
  setMaxPrice: Dispatch<SetStateAction<number | undefined>>;
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [categories, setCategories] = useState<FamilyCateogoryType[]>([]);
  const router = useRouter();

  const closeModal = () => {
    setIsOpenModal(false); // 모달 닫기
  };

  useEffect(() => {
    async function fetchCategories() {
      const categoriesRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
        {
          cache: "no-store",
        }
      );

      if (!categoriesRes.ok) {
        const categoriesJson: SimpleResponseType = await categoriesRes.json();
        alert(categoriesJson.message);
        return;
      }

      const categoriesJson: FamilyCateogoryType[] = await categoriesRes.json();
      setCategories(categoriesJson);
    }
    fetchCategories();
  }, []);

  if (!isOpenModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md pb-3">
        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-3">
          <div className="flex-1 text-center">가격 필터</div>
          <button
            type="button"
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            aria-label="Close"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="">
          <section className="space-y-2">
            <div className="flex items-center justify-center">
              <label htmlFor="priceMin" className="whitespace-nowrap">
                최소
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="priceMin"
                  className="ml-2 border text-right p-1 pr-7 focus:outline-none"
                  value={minPrice ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setMinPrice(value == "" ? undefined : Number(value));
                  }}
                />
                <span className="relative right-6">원</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <label htmlFor="priceMax" className="whitespace-nowrap">
                최대
              </label>
              <div className="flex items-center ">
                <input
                  type="text"
                  id="priceMax"
                  className="ml-2 border text-right p-1 pr-7 focus:outline-none"
                  value={maxPrice ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setMaxPrice(value == "" ? undefined : Number(value));
                  }}
                />
                <span className="relative right-6">원</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}
