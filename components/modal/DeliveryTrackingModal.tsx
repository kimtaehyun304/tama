import { Dispatch, SetStateAction, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default ({ isOpenModal, setIsOpenModal }: Props) => {
  const handleClose = () => {
    setIsOpenModal(false); // 모달 닫기
  };

  function saveDelivetyTracking() {}

  if (!isOpenModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <section className="space-y-4 grow">
          <div className="">
            {/* Modal Header */}
            <div className="flex p-3">
              <div className="grow text-center">운송장 등록</div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
                onClick={handleClose} // 닫기 버튼 동작
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
          </div>
          <section>
            <div className="font-bold text-2xl p-[1%] border-b">주문고객</div>
            <div className="p-[2%] space-y-3 max-w-[50rem]">
              <div className="flex items-center">
                <label
                  htmlFor="carrierCode"
                  className="w-32  whitespace-nowrap"
                >
                  택배 회사
                </label>
                <input
                  id="carrierCode"
                  type="text"
                  className="border p-3 grow"
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="trackingNumber" className="w-32">
                  운송장 번호
                </label>
                <input
                  id="trackingNumber"
                  type="text"
                  className="border p-3 grow"
                  placeholder="운송장 번호"
                />
              </div>
            </div>
          </section>

          <div className="flex gap-x-3 mb-3 justify-center">
            <button
              onClick={() => {
                saveDelivetyTracking();
                setIsOpenModal(false);
              }}
              className="bg-black text-white p-3 border"
            >
              저장
            </button>
          </div>
          
        </section>
      </section>
    </article>
  );
};
