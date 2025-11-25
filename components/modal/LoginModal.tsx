"use client";

import React, { useContext } from "react";

import { LoginModalContext } from "../context/LoginModalContext";
import LoginForm from "../LoginForm";

export default function () {
  const loginModalContext = useContext(LoginModalContext); // 모달 상태 관리

  const closeModal = () => {
    loginModalContext?.setIsOpenLoginModal(false);
    loginModalContext?.setIsContainOrder(false);
  };

  if (!loginModalContext?.isOpenLoginModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article>
      <section className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 px-3">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          {/* Modal Header */}
          <div className="flex justify-between border-b px-4 py-3">
            <h5 className="text-lg font-medium">로그인</h5>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
              onClick={closeModal} // 닫기 버튼 동작
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

          <LoginForm />
        </div>
      </section>
    </article>
  );
}
