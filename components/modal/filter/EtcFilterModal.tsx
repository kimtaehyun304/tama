import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  genders: GenderType[];
  setGenders: Dispatch<SetStateAction<GenderType[]>>;
  isContainSoldOut: boolean;
  setIsContainSoldOut: Dispatch<SetStateAction<boolean>>;
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  genders,
  setGenders,
  isContainSoldOut,
  setIsContainSoldOut,
}: Props) {
  const router = useRouter();

  const closeModal = () => {
    setIsOpenModal(false); // 모달 닫기
  };

  //필터 성별 체크박스
  function checkGender(gender: GenderType) {
    let newArr = [...genders];
    const index = newArr.indexOf(gender);
    // color.id가 이미 배열에 있으면 해당 인덱스에서 제거
    if (index !== -1) newArr.splice(index, 1);
    else newArr.push(gender);
    setGenders(newArr);
  }

  if (!isOpenModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md pb-3">
        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-3">
          <div className="flex-1 text-center">기타 필터</div>
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
        <section className="space-y-2 flex flex-col items-center ">
          <div className="">
            <label>
              <input
                type="checkbox"
                onChange={() => {
                  checkGender("MALE");
                }}
                checked={genders.includes("MALE")}
              />
              남성
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                id="female"
                onChange={() => {
                  checkGender("FEMALE");
                }}
                checked={genders.includes("FEMALE")}
              />
              여성
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                id="soldout"
                onChange={(event) => {
                  setIsContainSoldOut(event.target.checked);
                }}
                checked={isContainSoldOut}
              />
              품절포함
            </label>
          </div>
        </section>
      </section>
    </article>
  );
}
