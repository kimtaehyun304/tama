import BannerSlider from "@/components/slider/BannerSlider";
import CategoryBestItem from "./index/CategoryBestItem";
import LoginEffect from "./index/LoginEffect";
//서버 컴포넌트인데 csr되길래 사용
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