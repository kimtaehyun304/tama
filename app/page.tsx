"use client";

import { AuthContext } from "@/components/context/AuthContext";
import BannerSlider from "@/components/slider/BannerSlider";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const images: BannerImageType[] = [
  { src: "/banner1.jpg", alt: "Banner 1" },
  { src: "/banner2.jpg", alt: "Banner 2" },
  { src: "/banner3.jpg", alt: "Banner 3" },
];

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tempToken = searchParams.get("tempToken");
  const authContext = useContext(AuthContext);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();
  const [categoryBestItems, setCategoryBestItems] =
    useState<CategoryBestItemType[]>();

  const [parentCategories, setParentCategories] = useState<BaseCateogoryType[]>(
    []
  );

  //tempToken파라미터가 사라지기전에 새로고침하면 alert 발생
  useEffect(() => {
    if (tempToken) {
      router.replace(pathname);
      async function fetchAccessToken() {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/access-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tempToken: tempToken }),
          }
        );
        const data: AccessTokenType = await res.json();
        if (res.status !== 200) {
          alert(data.message);
          return;
        }
        localStorage.setItem("tamaAccessToken", data.accessToken);
        authContext?.setIsLogined(true);
      }
      fetchAccessToken();
    }
  }, []);

  useEffect(() => {
    async function fetchParentCategory() {
      const parentCategoryRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category/parent`,
        {
          cache: "no-store",
        }
      );

      const parentCategoryJson = await parentCategoryRes.json();
      if (!parentCategoryRes.ok) {
        alert(parentCategoryJson.message);
        return;
      }

      setParentCategories(parentCategoryJson);
    }
    fetchParentCategory();

    fetchCategoryBestItem(selectedCategoryId);
  }, [selectedCategoryId]);

  async function fetchCategoryBestItem(categoryId: number | undefined) {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", String(categoryId));
    params.append("page", String(1));
    params.append("size", String(10));

    const categoryBestItemRes = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }/api/items/best?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const categoryBestItems = await categoryBestItemRes.json();
    if (!categoryBestItemRes.ok) {
      alert(categoryBestItems.message);
      return;
    }
    setCategoryBestItems(categoryBestItems);
  }

  if (!categoryBestItems) return;

  return (
    <article className="xl:mx-standard">
      <BannerSlider images={images} />

      {/* 카테고리 베스트 */}
      <section className="xl:block my-16">
        <nav className="flex justify-between items-end border-b pb-6 px-3 xl:px-0 text">
          <div className="flex justify-start items-end gap-x-4">
            <span className="font-extrabold text-3xl">카테고리 베스트</span>
            {/* 주문 데이터가 부족해서 전일 적용 안함
            <span className="hidden xl:inline text-[#999]  text-sm">
              전일기준의 상품 매출, 판매 수량, 조회 수를 반영하여 선정됩니다.
            </span>
            */}
          </div>
          <Link href={"/"} className="text-end text-[#777]">
            더보기 &#10095;
          </Link>
        </nav>

        <nav className="">
          <div className="flex gap-x-2 text-sm justify-center xl:justify-start py-4">
            <button
              onClick={() => {
                setSelectedCategoryId(0);
              }}
              className="grid justify-items-center"
            >
              <Image
                className={`border p-1 rounded-lg bg-gray-200 ${
                  selectedCategoryId == 0 && `border-black`
                }`}
                src="/icon/icon-hamburger.png"
                alt="전체"
                width={60}
                height={60}
              />
              <span className="">전체</span>
            </button>

            {parentCategories.map((parentCategory, index) => (
              <button
                onClick={() => {
                  setSelectedCategoryId(parentCategory.id);
                }}
                className="grid justify-items-center"
                key={`parentCategory${index}`}
              >
                <Image
                  className={`border p-1 rounded-lg bg-gray-200 ${
                    selectedCategoryId == parentCategory.id && `border-black`
                  }`}
                  src={`/icon/icon-${parentCategory.name}.png`}
                  alt={parentCategory.name}
                  width={60}
                  height={60}
                />
                <span className="">{parentCategory.name}</span>
              </button>
            ))}

            {/*
            <Link href={"/"} className="">
              <div className="grid justify-items-center">
                <Image
                  src="/icon/icon-woman-fashion.jpg"
                  alt="mypae"
                  width={60}
                  height={60}
                />
                <div className="">여성패션</div>
              </div>
            </Link>

            <Link href={"/"} className="">
              <div className="grid justify-items-center">
                <Image
                  src="/icon/icon-man-fashion.jpg"
                  alt="mypae"
                  width={60}
                  height={60}
                />
                <div className="">남성패션</div>
              </div>
            </Link>

            <Link href={"/"} className="">
              <div className="grid justify-items-center">
                <Image
                  src="/icon/icon-sleep-wear.jpg"
                  alt="mypae"
                  width={60}
                  height={60}
                />
                <div className="">슬립웨어</div>
              </div>
            </Link>

            <Link href={"/"} className="">
              <div className="grid justify-items-center">
                <Image
                  src="/icon/icon-under-wear.jpg"
                  alt="mypae"
                  width={60}
                  height={60}
                />
                <div className="">언더웨어</div>
              </div>
            </Link>

            <Link href={"/"} className="">
              <div className="grid justify-items-center">
                <Image
                  src="/icon/icon-fashion-haberdashery.jpg"
                  alt="mypae"
                  width={60}
                  height={60}
                />
                <div className="">패션잡화</div>
              </div>
            </Link>
              */}
          </div>
          <div className="grid px-1 sm:px-0 gap-x-1 sm:gap-x-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 xl:gap-6 justify-items-center xl:justify-items-start">
            {categoryBestItems.map((item, index) => (
              <Link
                href={`/color-items/${item.colorItemId}`}
                key={`categoryBestimages-${index}`}
              >
                <ul className="relative max-w-[232px]">
                  <li>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${item.uploadFile.storedFileName}`}
                      alt={item.name}
                      width={232}
                      height={232}
                    />
                    <div className="absolute top-2 left-2 bg-[#ffffff] p-1">
                      {index + 1}위
                    </div>
                    <div className="">
                      <div className="py-1">{item.name}</div>
                      <div className="flex items-center gap-x-2 py-1">
                        <span>
                          <span className="font-semibold">
                            {item.discountedPrice
                              ? item.discountedPrice.toLocaleString("ko-KR")
                              : item.price.toLocaleString("ko-KR")}
                          </span>
                          원
                        </span>
                        <span className="text-sm text-[#aaa]">
                          {item.discountedPrice &&
                            `${item.price.toLocaleString("ko-KR")}원`}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-1 text-sm text-[#aaa]">
                        <Image
                          src="/icon/icon-star.png"
                          alt={item.name}
                          width={16}
                          height={16}
                        />
                        {item.avgRating}
                        <span>({item.reviewCount})</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </Link>
            ))}
          </div>
        </nav>
      </section>

      {/* 리뷰가 좋은 인기상품 */}
      {/*
      <section className="xl:block my-16">
        <nav className="flex justify-between items-end border-b pb-6 px-3 xl:px-0 text">
          <div className="flex justify-start items-end gap-x-4">
            <span className="font-extrabold text-3xl">
              {" "}
              리뷰가 좋은 인기상품
            </span>
            <span className="hidden xl:inline text-[#999]  text-sm">
              최근 30일간 별점과 리뷰수를 반영하여 선정된 제품입니다.
            </span>
          </div>
          <Link href={"/"} className="text-end text-[#777]">
            더보기 &#10095;
          </Link>
        </nav>

        <nav className="">
          <div className="grid px-1 sm:px-0 gap-x-1 sm:gap-x-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 xl:gap-6 justify-items-center xl:justify-items-start">
            {items.map((item, index) => (
              <Link
                href={`/items/${item.id}`}
                key={`categoryBestimages-${index}`}
              >
                <div className="relative max-w-[232px]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={232}
                    height={232}
                  />
                  <div className="absolute top-2 left-2 bg-[#ffffff] p-1">
                    {index + 1}위
                  </div>
                  <div className="">
                    <div className="py-1">{item.name}</div>
                    <div className="flex items-center gap-x-2 py-1">
                      <span>
                        <span className="font-semibold">
                          {item.discountedPrice
                            ? item.discountedPrice.toLocaleString("ko-KR")
                            : item.price.toLocaleString("ko-KR")}
                        </span>
                        원
                      </span>
                      <span className="text-sm text-[#aaa]">
                        {item.discountedPrice &&
                          `${item.price.toLocaleString("ko-KR")}원`}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1 text-sm text-[#aaa]">
                      <Image
                        src="/icon/icon-star.png"
                        alt={item.alt}
                        width={16}
                        height={16}
                      />
                      {item.starRatingAvg}
                      <span>({item.comments})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </section>
      */}
    </article>
  );
}
