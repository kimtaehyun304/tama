import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import StarRating from "../StarRating";
import { AuthContext } from "../context/AuthContext";
import InputStarRating from "../InputStarRating";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  orderItemName: string;
  memberInformation: MemberInformationType;
  orderItemId: number | undefined;
  onReviewSuccess: () => void; // 부모로부터 콜백을 받음
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  orderItemName,
  memberInformation,
  orderItemId,
  onReviewSuccess,
}: Props) {
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const authContext = useContext(AuthContext);

  const closeModal = () => {
    setIsOpenModal(false); // 모달 닫기
  };

  useEffect(() => {
    setHeight(memberInformation.height);
    setWeight(memberInformation.weight);
  }, []);

  async function saveReview() {
    if (authContext?.isLogined) {
      const saveReviewRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          body: JSON.stringify({
            orderItemId: orderItemId,
            rating: rating,
            comment: comment,
            height: height,
            weight: weight,
          }),
        }
      );
      const SimpleResponseJson: SimpleResponseType = await saveReviewRes.json();

      if (saveReviewRes.status == 201) {
        setIsOpenModal(false);
        setComment("");
        setRating(0);
        onReviewSuccess();
      }
      alert(SimpleResponseJson.message);
    }
  }

  if (!isOpenModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-3">
          <div className="flex-1 text-center">리뷰 작성</div>
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
        <section className="px-3">
          <div className="space-y-1">
            <div className="flex gap-x-1">
              <InputStarRating rating={rating} setRating={setRating} />
              <span className="before:content-['｜'] before:text-[#e0e0e0] after:content-['｜'] after:text-[#e0e0e0] ">
                {memberInformation.nickname}
              </span>
              <span className="">{today}</span>
            </div>
            <div className="flex">
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-20 border text-right pr-7 focus:outline-none"
                  value={height ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setHeight(value == "" ? undefined : Number(value));
                  }}
                />
                <span className="relative right-6">cm</span>
              </div>
              <div className="flex items-center grow">
                <input
                  type="text"
                  className="w-20  border text-right pr-7 focus:outline-none"
                  value={weight ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setWeight(value == "" ? undefined : Number(value));
                  }}
                />
                <span className="relative right-6">kg</span>
              </div>
            </div>
            <div>{orderItemName}</div>

            <textarea
              onChange={(e) => {
                e.currentTarget.style.height = "auto"; // 높이 초기화
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // 자동 조절
                setComment(e.target.value);
              }}
              className="border w-full overflow-hidden p-2"
              rows={8}
              value={comment}
            ></textarea>
          </div>
          <div className="text-center m-1">
            <button
              onClick={saveReview}
              className="border p-3 w-full bg-black text-white"
            >
              등록
            </button>
          </div>
        </section>
      </section>
    </article>
  );
}
