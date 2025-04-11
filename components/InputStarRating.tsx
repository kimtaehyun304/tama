import React from "react";

type Props = {
  rating?: number; // 기본 평점 (0 ~ 5 사이의 값)
  maxStars?: number; // 별의 최대 개수 (기본값: 5)
  setRating: React.Dispatch<React.SetStateAction<number>>;
};

export default function ({ rating = 0, maxStars = 5, setRating }: Props) {
  function changeRating(index: number) {
    setRating(index + 1);
  }

  return (
    <section className="flex items-center">
      {Array.from({ length: maxStars }, (_, index) => {
        const fillPercentage =
          Math.min(Math.max(rating - index, 0), 1) * 100;

        return (
          <div
            key={index}
            className="relative w-6 h-6 cursor-pointer"
            onClick={() => changeRating(index)}
          >
            {/* 배경 빈 별 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="absolute w-full h-full text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            {/* 채워진 별 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="gold"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="absolute w-full h-full text-yellow-400"
              style={{
                clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          </div>
        );
      })}
    </section>
  );
}
