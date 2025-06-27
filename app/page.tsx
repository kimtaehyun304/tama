"use client";

import BannerSlider from "@/components/slider/BannerSlider";
import CategoryBestItem from "./index/CategoryBestItem";
import { useFetchAccessToken } from "./index/useFetchAccessToken";


export default function Home() {
  useFetchAccessToken();

  return (
    <article className="xl:mx-standard">
      <BannerSlider />
      <CategoryBestItem />
    </article>
  );
}
