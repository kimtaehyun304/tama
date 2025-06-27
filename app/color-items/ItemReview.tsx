import ReviewList from "@/components/ReviewList";
import { Dispatch, RefObject, SetStateAction, useState } from "react";

type Props = {
  reviewRef: RefObject<HTMLDivElement>;
  activeSection: string;
  sort: string;
  setSortProperty: Dispatch<SetStateAction<string>>;
  setSortDirection: Dispatch<SetStateAction<string>>;
  reviews: ReviewType;
};

export default ({
  reviewRef,
  activeSection,
  sort,
  setSortProperty,
  setSortDirection,
  reviews,
}: Props) => {
  //정렬 open close
  const [display, setDisplay] = useState<string>("none");
  return (
    <div ref={reviewRef} className="p-2" hidden={activeSection !== "리뷰"}>
      {/* 정렬 리스트 */}
      <span className="inline-flex flex-col relative bg-white">
        <button
          className="p-2"
          onMouseEnter={() => setDisplay("block")}
          onMouseLeave={() => setDisplay("none")}
        >
          {sort}∨
        </button>
        <ul
          className="border space-y-2 absolute z-10 top-full bg-white px-4 whitespace-nowrap"
          style={{ display: display }}
          onMouseEnter={() => setDisplay("block")}
          onMouseLeave={() => setDisplay("none")}
        >
          <li>
            <button
              className="hover:underline hover:font-semibold"
              onClick={() => {
                setSortProperty("createdAt");
                setSortDirection("desc");
              }}
            >
              최신순
            </button>
          </li>
          <li>
            <button
              className="hover:underline hover:font-semibold"
              onClick={() => {
                setSortProperty("createdAt");
                setSortDirection("asc");
              }}
            >
              오래된순
            </button>
          </li>
        </ul>
      </span>
      <ReviewList review={reviews} />
    </div>
  );
};
