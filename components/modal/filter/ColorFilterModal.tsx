import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  colors: BaseColorType[];
  colorIds: number[];
  setColorIds: Dispatch<SetStateAction<number[]>>;
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  colors,
  colorIds,
  setColorIds,
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
          <div className="flex-1 text-center">색상 계열 필터</div>
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
        <section className="space-y-2 flex justify-center">
          <div className="grid grid-cols-2 justify-center gap-2">
            {colors.map((color, index) => (
              <div className="flex gap-x-1 items-center" key={`color${index}`}>
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px]"
                  id={`color${index}`}
                  onChange={() => {
                    const newArr = [...colorIds];
                    const idx = newArr.indexOf(color.id);
                    if (idx !== -1) newArr.splice(idx, 1);
                    else newArr.push(color.id);
                    setColorIds(newArr);
                  }}
                  checked={colorIds.includes(color.id)}
                />
                <label
                  htmlFor={`color${index}`}
                  className="flex items-center gap-x-1"
                >
                  <div
                    style={{ backgroundColor: color.hexCode }}
                    className="w-[18px] h-[18px] inline-block border"
                  ></div>
                  <span className="text-center">{color.name}</span>
                </label>
              </div>
            ))}
          </div>
        </section>
      </section>
    </article>
  );
}
