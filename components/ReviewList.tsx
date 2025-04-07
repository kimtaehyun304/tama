import MyPagination from "./MyPagination";
import StarRating from "./StarRating";

type props = {
  review: ReviewType;
};

export default ({ review }: props) => {
  return (
    <>
      <section>
        {/* 전체 평점 */}
        <div className="flex justify-center gap-x-2">
          <StarRating rating={review.avgRating} />
          {review.avgRating}
        </div>
        {review.content.map((content, index) => (
          <div key={`review-${index}`}>
            <div className="grid py-3 divide-y-2">
              <div className="py-3">
                <div className="flex gap-x-1">
                  <StarRating rating={content.rating} />
                  <span className="before:content-['｜'] before:text-[#e0e0e0] after:content-['｜'] after:text-[#e0e0e0] ">
                    {content.member.nickname}
                  </span>
                  <span className="">{content.createdAt.toString()}</span>
                </div>
                <div className="text-[#787878] text-lg">
                  <div>
                    {content.member.height}cm, {content.member.weight}kg
                  </div>
                  <div>{content.option}</div>
                </div>
                <div className="">{content.comment}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <MyPagination pageCount={review.page.pageCount} pageRangeDisplayed={5} />
    </>
  );
};
