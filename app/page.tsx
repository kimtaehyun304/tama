import BannerSlider from "@/components/slider/BannerSlider";
import CategoryBestItem from "./index/CategoryBestItem";
import LoginEffect from "./index/LoginEffect";
//pre-render를 위해 적용
export const dynamic = "force-dynamic"; // Next.js 13+

export default function Home() {
  return (
    <article className="xl:mx-standard">
      <BannerSlider />
      <CategoryBestItem />
      <LoginEffect />
    </article>
  );
}
