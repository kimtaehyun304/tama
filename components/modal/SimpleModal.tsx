"use client";
import { useContext } from "react";
import { SimpleModalContext } from "../context/SimpleModalContex";

export default function SimpleModal() {
  const context = useContext(SimpleModalContext); // 모달 상태 관리

  const closeModal = () => {
    context?.setIsOpenSimpleModal(false);
  };



  if (!context?.isOpenSimpleModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-3">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Modal Body */}
        <div className="">
          <div className="text-center py-4 text-lg">{context.message}</div>

          <div
            className="text-center bg-black cursor-pointer"
            onClick={closeModal}
          >
            <button className="text-white p-4">확인</button>
          </div>
        </div>
      </section>
    </article>
  );
}
