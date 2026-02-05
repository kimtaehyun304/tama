"use client";

import LoadingScreen from "@/components/LoadingScreen";
import ColorFilterModal from "@/components/modal/filter/ColorFilterModal";
import EtcFilterModal from "@/components/modal/filter/EtcFilterModal";
import ItemNameFilterModal from "@/components/modal/filter/itemNameFilterModal";
import PriceFilterModal from "@/components/modal/filter/PriceFilterModal";
import MyPagination from "@/components/MyPagination";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default () => {
  const params = useParams<{ categoryId: string }>();
  const categoryId = parseInt(params.categoryId);
  const [categoryItems, setCategoryItems] = useState<CategoryItemType>();
  const searchParams = useSearchParams();
  const pagePrams = Number(searchParams.get("page")) || 1;

  //아이템 개수
  const pageSize = 8;

  //배열을 만들고 아이템 개수만큼 selectedColorItemIndex를 할당한다. 초기값은 0
  //EX) pageSize 1 가정. 이 아이템 색상은 빨강, 파랑이다. 파랑 클릭하면 selectedColorItemIndex는 [0] -> [1] 바뀜
  const [selectedColorItemIndex, setSelectedColorItemIndex] = useState<
    number[]
  >(Array(pageSize).fill(0));

  //기본값 신상품순
  const [sortProperty, setSortProperty] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  //sortProperty,sortDirection로 분류한 sort 이름
  const [sort, setSort] = useState<string>("신상품순");

  //검색어
  const [itemName, setItemName] = useState<string>("");
  //fetchMinMaxPrice()로 채워짐
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [colorIds, setColorIds] = useState<number[]>([]);
  const [genders, setGenders] = useState<GenderType[]>([]);
  const [isContainSoldOut, setIsContainSoldOut] = useState<boolean>(false);
  //정렬 open close
  const [display, setDisplay] = useState<string>("none");

  const [categories, setCategories] = useState<FamilyCateogoryType[]>([]);
  const [colors, setColors] = useState<BaseColorType[]>([]);

  //검색 필터 모달(모바일용)
  const [isOpenItemNameFilterModal, setIsOpenItemNameFilterModal] =
    useState<boolean>(false);
  const [isOpenPriceFilterModal, setIsOpenPriceFilterModal] =
    useState<boolean>(false);
  const [isOpenColorFilterModal, setIsOpenColorFilterModal] =
    useState<boolean>(false);
  const [isOpenEtcFilterModal, setIsOpenEtcFilterModal] =
    useState<boolean>(false);

  //필터 적용 버튼에 필요해서 useEffect에서 분리
  async function fetchCategoryItems() {
    const params = new URLSearchParams();
    if (categoryId != 0) params.append("categoryId", String(categoryId));
    params.append("page", String(pagePrams));
    params.append("size", String(pageSize));
    params.append("sort", `${sortProperty},${sortDirection}`);

    if (itemName) params.append("itemName", itemName);
    if (minPrice) params.append("minPrice", String(minPrice));
    if (maxPrice) params.append("maxPrice", String(maxPrice));
    if (colorIds.length) params.append("colorIds", colorIds.join(","));
    if (genders.length) params.append("genders", genders.join(","));
    if (isContainSoldOut)
      params.append("isContainSoldOut", String(isContainSoldOut));

    const categoryItemRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items?${params.toString()}`,
      {
        cache: "no-store",
      }
    );
    const categoryItems = await categoryItemRes.json();
    if (!categoryItemRes.ok) {
      alert(categoryItems.message);
      return;
    }

    setCategoryItems(categoryItems);
  }

  useEffect(() => {
    async function fetchCategories() {
      const categoriesRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
        {
          cache: "no-store",
        }
      );

      const categoriesJson = await categoriesRes.json();
      if (!categoriesRes.ok) {
        alert(categoriesJson.message);
        return;
      }

      setCategories(categoriesJson);
      document.title =
        categoriesJson
          .flatMap((c: { children: BaseColorType[] }) => [
            c,
            ...(c.children || []),
          ])
          .find((c: { id: number }) => c.id == categoryId)?.name ?? "전체";
    }
    fetchCategories();

    async function fetchColors() {
      const colorsRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/colors/parent`,
        {
          cache: "no-store",
        }
      );

      const colorsJson = await colorsRes.json();

      if (!colorsRes.ok) {
        alert(colorsJson.message);
        return;
      }

      setColors(colorsJson);
    }
    fetchColors();
  }, []);

  useEffect(() => {
    fetchCategoryItems();
  }, [pagePrams, sortProperty, sortDirection]);

  useEffect(() => {
    function switchSort() {
      const value = `${sortProperty},${sortDirection}`;
      switch (value) {
        case "createdAt,desc":
          setSort("신상품순");
          break;
        case "price,asc":
          setSort("낮은가격순");
          break;
        case "price,desc":
          setSort("높은가격순");
          break;
      }
    }
    switchSort();
  }, [sortProperty, sortDirection]);

  //기본값 넣는 방벋도 있지만, 그러면 컴포넌트가 이동해서 어지러움
  if (!categoryItems) return <LoadingScreen />;

  //필터 성별 체크박스
  function checkGender(gender: GenderType) {
    const newArr = [...genders];
    const index = newArr.indexOf(gender);
    // color.id가 이미 배열에 있으면 해당 인덱스에서 제거
    if (index !== -1) newArr.splice(index, 1);
    else newArr.push(gender);
    setGenders(newArr);
  }

  return (
    <article className="xl:mx-32 xl:my-[2%] xl:flex gap-x-16">
      {/* 카테고리, 검색 필터*/}
      <aside className="hidden xl:block ">
        <section>
          <li
            className={`list-none ${
              categoryId === 0 ? "font-nanumGothicBold" : ""
            }`}
          >
            <Link href={`/category/0/item`}>전체</Link>
          </li>
          {categories.map((category, index) => (
            <ul className="py-1" key={`category${index}`}>
              <li
                className={
                  category.id === categoryId ? "font-nanumGothicBold " : ""
                }
              >
                <Link href={`/category/${category.id}/item`}>
                  {category.name}
                </Link>
              </li>
              {(category.id === categoryId ||
                category.children
                  .map((child) => child.id)
                  .includes(categoryId)) && (
                <ul className="bg-[#f8f8f8] py-2">
                  {category.children.map((child, categoryChildindex) => (
                    <li
                      className={`indent-4 py-2 text-sm ${
                        child.id === categoryId ? "font-bold" : ""
                      }`}
                      key={`categorychild${categoryChildindex}`}
                    >
                      <Link href={`/category/${child.id}/item`}>
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </ul>
          ))}
        </section>

        <section className="space-y-4">
          <div className="font-bold">필터</div>

          <section className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="itemName" className="whitespace-nowrap">
                검색어
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="itemName"
                  className="ml-2 border text-right p-1 focus:outline-none"
                  value={itemName}
                  onChange={(event) => {
                    setItemName(event.target.value);
                  }}
                />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div>가격</div>
            <div className="flex items-center">
              <label htmlFor="priceMin" className="whitespace-nowrap">
                최소
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="priceMin"
                  className="ml-2 border text-right p-1 pr-7 focus:outline-none"
                  value={minPrice ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setMinPrice(value == "" ? undefined : Number(value));
                  }}
                />
                <span className="relative right-6">원</span>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="priceMax" className="whitespace-nowrap">
                최대
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="priceMax"
                  className="ml-2 border text-right p-1 pr-7 focus:outline-none"
                  value={maxPrice ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setMaxPrice(value == "" ? undefined : Number(value));
                  }}
                />
                <span className="relative right-6">원</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div>색상 계열</div>
            <div className="grid grid-cols-2">
              {colors.map((color, index) => (
                <div className="flex gap-x-1" key={`color${index}`}>
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px]"
                    id={`color${index}`}
                    onChange={() => {
                      const newArr = [...colorIds];
                      const index = newArr.indexOf(color.id);
                      // color.id가 이미 배열에 있으면 해당 인덱스에서 제거
                      if (index !== -1) newArr.splice(index, 1);
                      else newArr.push(color.id);
                      setColorIds(newArr);
                    }}
                  />
                  <label htmlFor={`color${index}`}>
                    <div
                      style={{ backgroundColor: color.hexCode }}
                      className={`w-[18px] h-[18px] inline-block border`}
                    ></div>
                  </label>
                  <label htmlFor={`color${index}`}>{color.name}</label>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <div>기타</div>
            <div className="">
              <input
                type="checkbox"
                id="male"
                onChange={() => {
                  checkGender("MALE");
                }}
              />
              <label htmlFor="male">남성</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="female"
                onChange={() => {
                  checkGender("FEMALE");
                }}
              />
              <label htmlFor="female">여성</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="soldout"
                onChange={(event) => {
                  setIsContainSoldOut(event.target.checked);
                }}
              />
              <label htmlFor="soldout">품절포함</label>
            </div>
          </section>
        </section>

        <button
          className="border p-3 w-full"
          onClick={() => {
            fetchCategoryItems();
          }}
        >
          적용
        </button>
      </aside>

      {/*상품 리스트 */}
      <section className="grow mx-[1%] lg:mx-0">
        <div className="space-x-4">
          <span>
            <span className="font-semibold pr-1">전체 상품</span>
            <span className="font-semibold text-[#d99c63]">
              {categoryItems.page.rowCount}
            </span>
          </span>
          {/* 정렬 리스트 */}
          <span className="inline-flex flex-col relative bg-white">
            <button
              className="p-2"
              onMouseEnter={() => setDisplay("block")}
              onMouseLeave={() => setDisplay("none")}
            >
              {sort}∨
            </button>
            <ul
              className="border space-y-2 absolute z-10 top-full bg-white px-4 whitespace-nowrap"
              style={{ display: display }}
              onMouseEnter={() => setDisplay("block")}
              onMouseLeave={() => setDisplay("none")}
            >
              <li>
                <button
                  className="hover:underline hover:font-semibold"
                  onClick={() => {
                    setSortProperty("createdAt");
                    setSortDirection("desc");
                  }}
                >
                  신상품순
                </button>
              </li>
              <li>
                <button
                  className="hover:underline hover:font-semibold"
                  onClick={() => {
                    setSortProperty("price");
                    setSortDirection("asc");
                  }}
                >
                  낮은가격순
                </button>
              </li>
              <li>
                <button
                  className="hover:underline hover:font-semibold"
                  onClick={() => {
                    setSortProperty("price");
                    setSortDirection("desc");
                  }}
                >
                  높은가격순
                </button>
              </li>
            </ul>
          </span>
        </div>

        <div className="xl:hidden">
          <div className="flex gap-x-3 my-3 ">
            <button
              onClick={() => setIsOpenItemNameFilterModal(true)}
              className="border p-3"
            >
              검색어
            </button>
            <button
              onClick={() => setIsOpenPriceFilterModal(true)}
              className="border p-3"
            >
              가격
            </button>
            <button
              onClick={() => setIsOpenColorFilterModal(true)}
              className="border p-3"
            >
              색상
            </button>
            <button
              onClick={() => setIsOpenEtcFilterModal(true)}
              className="border p-3"
            >
              기타
            </button>
            <button
              onClick={fetchCategoryItems}
              className="border p-3 bg-black text-white"
            >
              적용
            </button>
          </div>
          <ItemNameFilterModal
            isOpenModal={isOpenItemNameFilterModal}
            setIsOpenModal={setIsOpenItemNameFilterModal}
            itemName={itemName}
            setItemName={setItemName}
          />
          <PriceFilterModal
            isOpenModal={isOpenPriceFilterModal}
            setIsOpenModal={setIsOpenPriceFilterModal}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
          <ColorFilterModal
            isOpenModal={isOpenColorFilterModal}
            setIsOpenModal={setIsOpenColorFilterModal}
            colors={colors}
            colorIds={colorIds}
            setColorIds={setColorIds}
          />
          <EtcFilterModal
            isOpenModal={isOpenEtcFilterModal}
            setIsOpenModal={setIsOpenEtcFilterModal}
            genders={genders}
            setGenders={setGenders}
            isContainSoldOut={isContainSoldOut}
            setIsContainSoldOut={setIsContainSoldOut}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:gird-cols-4 lg:grid-cols-4 gap-1 pb-6">
          {categoryItems.content.map((item, categoryItemindex) => (
            <ul key={`categoryItems${categoryItemindex}`}>
              <li className="">
                <Link
                  href={`/color-items/${
                    item.relatedColorItems[
                      selectedColorItemIndex[categoryItemindex]
                    ].colorItemId
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${
                      item.relatedColorItems[
                        selectedColorItemIndex[categoryItemindex]
                      ].uploadFile.storedFileName
                    }`}
                    alt={item.name}
                    width={232}
                    height={232}
                    unoptimized
                  />
                </Link>
                <div className="pt-3">
                  <Link
                    href={`/color-items/${
                      item.relatedColorItems[
                        selectedColorItemIndex[categoryItemindex]
                      ].colorItemId
                    }`}
                  >
                    <div>{item.name}</div>
                    <div className="flex gap-x-1">
                      {item.discountedPrice && (
                        <span className="font-semibold text-[#d99c63]">
                          {100 -
                            Math.round(
                              (item.discountedPrice / item.price) * 100
                            )}
                          %
                        </span>
                      )}
                      {(item.discountedPrice || item.price).toLocaleString(
                        "ko-kr"
                      )}
                      원
                    </div>
                  </Link>
                  <div className="flex gap-x-1">
                    {item.relatedColorItems.map((related, relatdIndex) => (
                      <div
                        style={{ backgroundColor: related.hexCode }}
                        className={`w-[20px] h-[20px] inline-block border cursor-pointer ${
                          relatdIndex ===
                          selectedColorItemIndex[categoryItemindex]
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                        data-tooltip={related.color}
                        key={`relatdColrItem${relatdIndex}`}
                        onClick={() => {
                          const newArr = [...selectedColorItemIndex];
                          newArr[categoryItemindex] = relatdIndex;
                          setSelectedColorItemIndex(newArr);
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          ))}
        </div>

        <MyPagination
          pageCount={categoryItems.page.pageCount}
          pageRangeDisplayed={5}
        />
      </section>
    </article>
  );
};
