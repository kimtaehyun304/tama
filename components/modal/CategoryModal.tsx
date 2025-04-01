import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function ({ isOpenModal, setIsOpenModal }: Props) {
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
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-3">
          <div className="flex-1 text-center">카테고리</div>
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
          <div className="flex gap-x-3 justify-center">
            <button
              onClick={() => {
                setSelectedCategoryId(0);
              }}
              className="grid justify-items-center"
            >
              <div
                onClick={() => {
                  router.push("/category/0/item");
                  setIsOpenModal(false);
                }}
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
              </div>
            </button>
            {categories.map((cateogry, index) => (
              <button
                onClick={() => {
                  setSelectedCategoryId(cateogry.id);
                }}
                className="grid justify-items-center"
                key={`parentCategory${index}`}
              >
                <Image
                  className={`border p-1 rounded-lg bg-gray-200 ${
                    selectedCategoryId == cateogry.id && `border-black`
                  }`}
                  src={`/icon/icon-${cateogry.name}.png`}
                  alt={cateogry.name}
                  width={60}
                  height={60}
                />
                <span className="">{cateogry.name}</span>
              </button>
            ))}
          </div>

          {categories.map(
            (category, index) =>
              selectedCategoryId === category.id && (
                <ul className="grid grid-cols-3" key={`category${index}`}>
                  <li
                    onClick={() => {
                      router.push(`/category/${category.id}/item`);
                      setIsOpenModal(false);
                    }}
                    className="border flex-1 text-center"
                  >
                    전체
                  </li>
                  {category.children.map((child, childIndex) => (
                    <li
                      onClick={() => {
                        router.push(`/category/${child.id}/item`);
                        setIsOpenModal(false);
                      }}
                      className="border flex-1 text-center"
                      key={`child${childIndex}`}
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              )
          )}
        </div>
      </section>
    </article>
  );
}
