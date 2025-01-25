"use client";

import ItemSlider from "@/components/slider/ItemSlider";

const item = {
  src: [
    "/woman-pants.jpg",
    "/woman-pants-detail.jpg",
    "/woman-pants-detail2.jpg",
    "/woman-pants-detail.jpg",
    "/woman-pants-detail2.jpg",
    "/woman-pants-detail.jpg",
    "/woman-pants-detail2.jpg",
  ],
  relatedSrc: ["/woman-pants.jpg", "/woman-pink-pants.jpg"],
  code: "J124401105",
  stock: 3,
  yearSeason: "24 F/W",
  name: "여 코듀로이 와이드 팬츠",
  price: 49900,
  discountedPrice: 39900,
  color: "아이보리",
  options: ["S(67CM)", "M(70CM)", "L(73CM)"],
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
const images: BannerImageType[] = [
  { src: "/banner1.jpg", alt: "Banner 1" },
  { src: "/banner2.jpg", alt: "Banner 2" },
  { src: "/banner3.jpg", alt: "Banner 3" },
];

export default function Home() {
  return (
    <main className="xl:mx-standard">
      <ItemSlider images={item.src} itemName={item.name} />
    </main>
  );
}
