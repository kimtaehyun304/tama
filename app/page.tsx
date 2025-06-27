"use client";

import CategoryBestItem from "./index/CategoryBestItem";
import { useFetchAccessToken } from "./index/useFetchAccessToken";


export default function Home() {
  useFetchAccessToken();

  return (
    <article className="xl:mx-standard">
      <CategoryBestItem />
    </article>
  );
}
