"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import ItemRetrunGuide from "@/components/ItemReturnGuide";
import LoadingScreen from "@/components/LoadingScreen";
import LoginModal from "@/components/modal/LoginModal";
import OutOfStockModal from "@/components/modal/OutOfStockModal";
import Review from "@/components/Review";
import ItemSlider from "@/components/slider/ItemSlider";
import StarRating from "@/components/StarRating";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
/*

const item = {
  id: 2411929109,
  src: [
    "/woman-pants.jpg",
    "/woman-pants-detail.jpg",
    "/woman-pants-detail2.jpg",
    "/woman-pants-detail.jpg",
    "/woman-pants-detail2.jpg",
    "/woman-pants-detail.jpg",
    "/woman-pants-detail2.jpg",
  ],
  related: [
    { id: 2411929109, src: "/woman-pants.jpg", color: "화이트" },
    { id: 2411929110, src: "/woman-pink-pants.jpg", color: "핑크" },
    { id: 2411929109, src: "/woman-pants.jpg", color: "화이트" },
    { id: 2411929110, src: "/woman-pink-pants.jpg", color: "핑크" },
  ],
  seller: "tama",
  code: "J124401105",
  yearSeason: "24 F/W",
  name: "여 코듀로이 와이드 팬츠",
  price: 49900,
  discountedPrice: 39900,
  color: "아이보리",
  //stock: 1,
  sizes: [
    {
      size: "S(67CM)",
      stock: 1,
    },
    {
      size: "M(70CM)",
      stock: 0,
    },
    {
      size: "L(73CM)",
      stock: 3,
    },
    {
      size: "XL(76CM)",
      stock: 4,
    },
  ],
  detail: {
    content:
      "무형광 원단입니다. 전 년 상품 자주히트와 동일한 소재이며, 네이밍이변경되었습니다.",
    dateOfManufacture: "2024-08",
    countryOfManufacture: "방글라데시",
    manufacturer: "(주)신세계인터내셔날",
    category: "이너웨어",
    textile:
      "폴리에스터 94%, 폴리우레탄 6% (상표,장식,무늬,자수,밴드,심지,보강재 제외)",
    precaution:
      "세제는 중성세제를 사용하고 락스 등의 표백제는 사용을 금합니다. 세탁 시 삶아 빨 경우 섬유의 특성이 소멸되어 수축 및 물빠짐의 우려가 있으므로 미온 세탁하시기 바랍니다.",
  },
};
*/

const reviews: ReviewType = {
  result: 22,
  starRatingAvg: 3.5,
  data: [
    {
      rating: 5,
      email: "berry1234",
      createdAt: new Date("2024-12-16"),
      height: 156,
      weight: 45,
      item: "베이지/S(90)",
      content:
        "S사이즈로 아주 약간 큰 편이지만 키에 거의 딱 맞는거 같아요. 땀듯해서 입기 좋습니다ㅎㅎ",
    },
    {
      rating: 5,
      email: "berry1234",
      createdAt: new Date("2024-12-16"),
      height: 156,
      weight: 45,
      item: "베이지/S(90)",
      content:
        "S사이즈로 아주 약간 큰 편이지만 키에 거의 딱 맞는거 같아요. 땀듯해서 입기 좋습니다ㅎㅎ",
    },
  ],
};

type Props = {
  colorItem: ColorItemType;
};

export default function Client({ colorItem }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const itemDetailRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const itemReturnGuideRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("상품상세정보");
  const [orderCount, setOrderCount] = useState<number>(1);
  //const [isOutedOfStock, setIsOutedOfStock] = useState(false);
  const [isOpenOutOfStockModal, setIsOpenOutOfStockModal] = useState(false);
  //옷 사이즈 바꿀때 사용
  const [stock, setStock] = useState(colorItem.stocks[0].stock);
  const [sizeIndex, setSizeIndex] = useState(0);
 
  const simpleModalContext = useContext(SimpleModalContext); // 모달 상태 관리

  function changeItem(index: number) {
    setOrderCount(1);
    setSizeIndex(index);
    setStock(colorItem.stocks[index].stock);
  }

  function handleNavClick(section: string) {
    setActiveSection(section);

    switch (activeSection) {
      case "상품상세정보":
        itemDetailRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "리뷰":
        reviewRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "배송/상품/교환안내":
        itemReturnGuideRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
    }
  }

  function plusOurderCount() {
    if (stock === orderCount) {
      setIsOpenOutOfStockModal(true);
      return;
    }

    if (stock > orderCount) {
      setOrderCount(orderCount + 1);
    }
  }

  function minusOurderCount() {
    if (orderCount > 1) setOrderCount(orderCount - 1);
  }

  function putItemInShoppingBag() {
    const itemToPut = {
      itemStockId: colorItem.stocks[sizeIndex].id,
      orderCount: orderCount,
    };

    const jsonString = localStorage.getItem("tamaCart");

    if (jsonString) {
      let jsons: LocalStorageCartItemType[] = JSON.parse(jsonString);
      const foundIndex = jsons.findIndex(
        (json) => json.itemStockId === itemToPut.itemStockId
      );
      foundIndex === -1
        ? jsons.push(itemToPut)
        : (jsons[foundIndex] = itemToPut);
      localStorage.setItem("tamaCart", JSON.stringify(jsons));
    } else localStorage.setItem("tamaCart", JSON.stringify(Array(itemToPut)));

    simpleModalContext?.setMessage("쇼핑백에 상품을 담았습니다.")
    simpleModalContext?.setIsOpenSimpleModal(true);

  }

  return (
    <article className="xl:mx-standard xl:my-[2%]">
      {/*재고 부족 모달*/}
      <OutOfStockModal
        stock={stock}
        isOpenOutOfStockModal={isOpenOutOfStockModal}
        setIsOpenOutOfStockModal={setIsOpenOutOfStockModal}
      />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-x-20 mx-[2%] ">
        {/*(좌) 상품 이미지 및 리뷰 */}
        <div className="">
          <ItemSlider
            images={colorItem.images}
            itemName={colorItem.common.name}
          />

          <div className="flex justify-between border-y py-4">
            <StarRating rating={reviews.starRatingAvg} />
            <div
              className="underline cursor-pointer"
              onClick={() => {
                handleNavClick("리뷰");
              }}
            >
              상품리뷰 더보기 ({reviews.result})
            </div>
          </div>
        </div>

        {/*(우) 상품 설명 및 구매  */}
        <div className="pt-3 xl:pt-0">
          {/*상품 설명 */}
          <div className="">
            <div className="flex justify-between">
              <span className="p-1 mt-1 text-[#d99c63] border border-[#d99c63] ">
                {colorItem.common.yearSeason}
              </span>
              <div className="flex">
                <Image
                  src="/icon/icon-heart.png"
                  alt="icon-heart"
                  width={40}
                  height={40}
                />
                <Image
                  src="/icon/icon-share.png"
                  alt="icon-share"
                  width={40}
                  height={40}
                />
              </div>
            </div>

            <div className="py-2 mt-3 text-[#a0a0a0]">
              공통 상품 코드 {colorItem.common.id}
            </div>
            <div className="py-2 text-xl">{colorItem.common.name}</div>
            <div className="py-2 flex items-end gap-x-4">
              {colorItem.stocks[0].discountedPrice && (
                <span className="font-semibold text-3xl text-[#d99c63]">
                  {100 -
                    Math.round(
                      (colorItem.stocks[0].discountedPrice /
                        colorItem.stocks[0].price) *
                        100
                    )}
                  %
                </span>
              )}

              <span className="text-3xl">
                <span className="font-semibold">
                  {colorItem.stocks[0].discountedPrice
                    ? colorItem.stocks[0].discountedPrice.toLocaleString(
                        "ko-KR"
                      )
                    : colorItem.stocks[0].price.toLocaleString("ko-KR")}
                </span>
                원
              </span>

              {colorItem.stocks[0].discountedPrice && (
                <span className="text-lg text-[#a0a0a0]">
                  <span className="">
                    {colorItem.stocks[0].price.toLocaleString("ko-KR")}
                  </span>
                  원
                </span>
              )}
            </div>
          </div>

          {/*배송 정보 및 구매 옵션 */}
          <div className="border-t-2 py-3 text-sm xl:text-xl  ">
            {/*배송 정보*/}
            <div className="grid gap-y-5 pb-3 border-b-2">
              {/*
              <div className="flex justify-between">
                <div className="font-semibold">카드혜택</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <span className="underline cursor-pointer pr-5">
                    할부혜택
                  </span>
                  <span className="underline cursor-pointer">
                    카드혜택 즉시할인
                  </span>
                </div>
              </div>
              */}
              <div className="flex justify-between">
                <div className="font-semibold">적립예정포인트</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <span className="underline cursor-pointer">
                    0.5%({Math.round(colorItem.stocks[0].price / 200)}P)
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">배송비</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  {colorItem.stocks[0].discountedPrice >= 40000
                    ? "무료"
                    : "3,000원 (40,000원 이상 결제 시 무료)"}
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="font-semibold">배송기간</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <div className="mb-3">
                    15시 30분까지 결제 시{" "}
                    <span className="font-semibold text-[#d99c63]">
                      오늘 출발
                    </span>
                  </div>
                  <div className="bg-[#f8f8f8] p-3 inline-block ">
                    <div className="grid gap-y-3">
                      <div className="flex gap-x-4">
                        <div>D+1 도착확률</div>
                        <div>93.3%</div>
                      </div>
                      <div className="flex gap-x-4">
                        <div>D+2 도착확률</div>
                        <div>99.2%</div>
                      </div>
                      <div className="flex gap-x-4">
                        <div>D+3 도착확률</div>
                        <div>100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-y-5 py-3">
              <div className="flex justify-between">
                <div className="font-semibold">색상</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <div className="mb-3 font-medium text-[#a0a0a0]">
                    {colorItem.color}
                  </div>
                  <div className="flex gap-x-4 overflow-x-auto">
                    {colorItem.relatedColorItems.map((related, index) => (
                      <Image
                        key={`relatedItem-${index}`}
                        src={related.imageSrc}
                        alt={related.color}
                        width={50}
                        height={50}
                        className={
                          related.id === colorItem.id
                            ? "border-[1px] border-black"
                            : ""
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/*구매 옵션 */}
              <div className="flex justify-between">
                <div className="font-semibold">옵션</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <div className="flex gap-x-3 overflow-x-auto">
                    {colorItem.stocks.map((size, index) => (
                      <button
                        key={`option-${index}`}
                        className={
                          sizeIndex === index
                            ? "border-[1px] border-black p-1 text-sm"
                            : "border p-1 text-sm"
                        }
                        onClick={() => changeItem(index)}
                        disabled={size.stock === 0}
                      >
                        <div> {size.size}</div>
                        {size.stock === 0 && (
                          <div className="text-red-500">품절</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="font-semibold">수량</div>
                <div className="w-[calc(100%-125px)] xl:w-[calc(100%-180px)]">
                  <div className="grid grid-cols-[1fr_4fr_1fr]">
                    <button
                      className="border p-2"
                      onClick={() => {
                        minusOurderCount();
                      }}
                    >
                      -
                    </button>
                    <button className="border p-2">{orderCount}</button>
                    <button
                      className="border p-2"
                      onClick={() => {
                        plusOurderCount();
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between my-3">
                <div className="text-xl font-bold py-3">판매가</div>
                <div>
                  <span className="text-4xl font-bold">
                    {colorItem.stocks[0].discountedPrice
                      ? (
                          colorItem.stocks[0].discountedPrice * orderCount
                        ).toLocaleString("ko-KR")
                      : (colorItem.stocks[0].price * orderCount).toLocaleString(
                          "ko-KR"
                        )}
                  </span>
                  원
                </div>
              </div>
              <div className="grid grid-cols-3 gap-x-1 xl:text-2xl">
                <button className="border p-4">선물하기</button>
                <button
                  className="border p-4 bg-[#787878] text-[#fff]"
                  onClick={() => putItemInShoppingBag()}
                >
                  쇼핑백 담기
                </button>
                <button className="border p-4 bg-[#131922] text-[#fff]">
                  바로 구매
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <nav className="text-xl grid grid-cols-3 justify-stretch p-3">
          <button
            className={`border-b pb-4 ${
              activeSection === "상품상세정보" ? "border-black font-bold" : ""
            }`}
            onClick={() => handleNavClick("상품상세정보")}
          >
            상품상세정보
          </button>
          <button
            className={`border-b pb-4 ${
              activeSection === "리뷰" ? "border-black font-bold" : ""
            }`}
            onClick={() => handleNavClick("리뷰")}
          >
            리뷰({reviews.result})
          </button>
          <button
            className={`border-b pb-4 ${
              activeSection === "배송/상품/교환안내"
                ? "border-black font-bold"
                : ""
            }`}
            onClick={() => handleNavClick("배송/상품/교환안내")}
          >
            배송/상품/교환안내
          </button>
        </nav>

        {/* 상품상세정보*/}
        <div
          ref={itemDetailRef}
          className="px-2"
          hidden={activeSection !== "상품상세정보"}
        >
          <div className="bg-[#e0e0e0] font-bold text-lg p-6 my-6">
            {colorItem.common.description}
          </div>
          <div>
            <div className="font-semibold text-2xl py-1">상품상세정보</div>
            <div className="border-y-2 px-2 divide-y-2">
              <div className="flex justify-between py-3">
                <span className="font-semibold">제조연월</span>
                <span className="w-[calc(100%-150px)] xl:w-[calc(100%-180px)]">
                  {colorItem.common.dateOfManufacture}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold">제조국</span>
                <span className="w-[calc(100%-150px)] xl:w-[calc(100%-180px)]">
                  {colorItem.common.countryOfManufacture}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold">제조자/수입자</span>
                <span className="w-[calc(100%-150px)] xl:w-[calc(100%-180px)]">
                  {colorItem.common.manufacturer}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold">종류</span>
                <span className="w-[calc(100%-150px)] xl:w-[calc(100%-180px)]">
                  {colorItem.common.category}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold">소재</span>
                <span className="w-[calc(100%-150px)] xl:w-[calc(100%-180px)]">
                  {colorItem.common.textile}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold">취급 시 주의사항</span>
                <span className="w-[calc(100%-150px)] xl:w-[calc(100%-180px)]">
                  {colorItem.common.precaution}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 */}
        <div ref={reviewRef} className="p-2" hidden={activeSection !== "리뷰"}>
          <Review reviews={reviews} />
        </div>

        {/* 배송/상품/교환안내 */}
        <div
          ref={itemReturnGuideRef}
          className="p-2"
          hidden={activeSection !== "배송/상품/교환안내"}
        >
          <ItemRetrunGuide />
        </div>
      </section>
    </article>
  );
}
