import React from "react";
import StarRating from "./StarRating";
import { ReviewType } from "@/type/review-type";

const rating = 3.5;

type props = {
  reviews: ReviewType;
};

export default function Review({ reviews }: props) {
  return (
    <section>
      {/* 전체 평점 */}
      <div className="flex justify-center gap-x-2">
        <StarRating rating={3.5} />
        {rating}
      </div>
      {reviews.data.map((review, index) => (
        <div key={`review-${index}`}>
          <div className="grid py-3 divide-y-2">
            <div className="py-3">
              <div className="flex gap-x-3 divide-x-2">
                <StarRating rating={review.rating} />
                <span className="px-3">{review.email}</span>
                <span className="px-3">
                  {review.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="text-[#787878]  font-semibold text-lg">
                <div>
                  {review.item} & {review.height}cm {review.weight}kg
                </div>
              </div>
              <div className="font-semibold">{review.content}</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
