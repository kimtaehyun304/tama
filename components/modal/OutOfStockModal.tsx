"use client"
import { Dispatch, SetStateAction } from "react";

type Props = {
  stock: number;
  isOpenOutOfStockModal: boolean;
  setIsOpenOutOfStockModal: Dispatch<SetStateAction<boolean>>
};

export default function OutOfStockModal({ stock, isOpenOutOfStockModal, setIsOpenOutOfStockModal }: Props) {
  //const [isOpen, setIsOpen] = useState(true); // 모달 상태 관리

  const handleClose = () => {
    setIsOpenOutOfStockModal(false); // 모달 닫기
  };

  if (!isOpenOutOfStockModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h5 className="text-lg font-medium">재고 부족</h5>
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

        {/* Modal Body */}
        <div className="p-4">
          <p>{`해당 상품의 남은 수량은 ${stock}개입니다.`}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            onClick={handleClose} // Close 버튼 동작
          >
            Close
          </button>
        </div>
      </section>
    </article>
  );
}
