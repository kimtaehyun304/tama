import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  itemName: string;
  setItemName: Dispatch<SetStateAction<string>>;
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  itemName,
  setItemName,
}: Props) {
  const closeModal = () => {
    setIsOpenModal(false); // 모달 닫기
  };

  if (!isOpenModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md pb-3">
        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-3">
          <div className="flex-1 text-center">아이템 이름 검색</div>
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
              <div className="flex items-center">
                <input
                  type="text"
                  id="priceMin"
                  className="ml-2 border text-right p-1 focus:outline-none"
                  value={itemName}
                  onChange={(event) => {
                    setItemName(event.target.value);
                  }}
                  placeholder="코듀로이"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}
