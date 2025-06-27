import ItemSlider from "@/components/slider/ItemSlider";
import StarRating from "@/components/StarRating";

type Props = {
  colorItem: ColorItemType;
  reviews: ReviewType;
  handleNavClick: (section: string) => void;
};

export default ({ colorItem, reviews, handleNavClick }: Props) => {
  return (
    <section className="">
      <ItemSlider uploadFiles={colorItem.uploadFiles} />

      <div className="flex justify-between border-y py-4">
        <StarRating rating={reviews?.avgRating} />
        <div
          className="underline cursor-pointer"
          onClick={() => {
            handleNavClick("리뷰");
          }}
        >
          상품리뷰 더보기 ({reviews.page.rowCount})
        </div>
      </div>
    </section>
  );
};
