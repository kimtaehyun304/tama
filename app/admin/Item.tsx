"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { LoginModalContext } from "@/components/context/LoginModalContext";

export default () => {
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const loginModalContext = useContext(LoginModalContext);

  //fetch
  const [categories, setCategories] = useState<FamilyCateogoryType[]>([]);
  const [colors, setColors] = useState<FamilyColorType[]>([]);

  //input
  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [discountedPrice, setDiscountedPrice] = useState<number>();
  const [gender, setGender] = useState<GenderType>("BOTH");
  const [yearSeason, setYearSeason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dateOfManufacture, setDateOfManufacture] = useState<string>("");
  const [countryOfManufacture, setCountryOfManufacture] = useState<string>("");
  const [manufacturer, setManufacturer] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  //const [selectedColorId, setSelectedColorId] = useState<number>();
  const [selectedColorIds, setSelectedColorIds] = useState<
    (number | undefined)[]
  >([undefined]);

  const [sizes, setSizes] = useState<string[]>([""]);

  const [textile, setTextile] = useState<string>("");
  const [precaution, setPrecaution] = useState<string>("");

  const [isActiveCategoryUl, setIsActiveCategoryUl] = useState(false);
  const [isActiveColorUls, setIsActiveColorUls] = useState<boolean[]>([]);

  const [categoryMap, setCategoryMap] = useState<Map<number, string>>();
  const [colorMap, setColorMap] = useState<Map<number, string>>();

  // 초기 상태 설정: 색상별 재고
  // const [colorItems, setColorItems] = useState<SaveColorItemRequest[]>([]);
  const [stocks, setStocks] = useState<number[][]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
        {
          cache: "no-store",
        }
      );

      const categoriesRes = await res.json();

      if (!res.ok) {
        alert(categoriesRes.message);
        return;
      }

      if (Array.isArray(categoriesRes)) {
        setCategories(categoriesRes);

        //1. 배열 평탄화
        const flatCategories = categoriesRes.flatMap((category) => [
          { id: category.id, name: category.name }, // 부모 카테고리 추가
          ...(category.children ?? []), // children이 존재하면 추가
        ]);

        //2. 배열 map으로 변경
        const newMap = new Map<number, string>(
          flatCategories.map((category: { id: number; name: string }) => [
            category.id,
            category.name,
          ])
        );
        setCategoryMap(newMap);
      }
    }

    fetchCategories();

    async function fetchColors() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/colors`,
        {
          cache: "no-store",
        }
      );

      const colorRes = await res.json();

      // 요청이 실패했을 경우 에러 메시지 처리
      if (!res.ok && "message" in colorRes) {
        alert(colorRes.message);
        return;
      }

      if (Array.isArray(colorRes)) {
        setColors(colorRes);

        //1. 배열 평탄화
        const flatColors = colorRes.flatMap((color) => [
          { id: color.id, name: color.name }, // 부모 카테고리 추가
          ...(color.children ?? []), // children이 존재하면 추가
        ]);

        //2. 배열 map으로 변경
        const newMap = new Map<number, string>(
          flatColors.map((color: { id: number; name: string }) => [
            color.id,
            color.name,
          ])
        );

        setColorMap(newMap);
      }
    }

    fetchColors();
  }, []);

  /*
  useEffect(() => {
    console.log(stocks);
  }, [stocks]);
  */

  async function saveItem() {
    const colorItems = selectedColorIds.map((selectedColorId, index) => {
      return {
        colorId: selectedColorId,
        files: [], // 파일을 처리할 경우 적절히 배열을 채워야 합니다.
        sizeStocks: sizes.map((size, sizeIndex) => ({
          size,
          stock: stocks[index]?.[sizeIndex] || 0, // stocks는 각 색상 및 사이즈에 대한 재고 정보를 담고 있어야 합니다.
        })),
      };
    });


    
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName,
          categoryId: selectedCategoryId,
          price: price,
          discountedPrice: discountedPrice,
          gender: gender,
          description: description,
          yearSeason: yearSeason,
          dateOfManufacture: dateOfManufacture,
          countryOfManufacture: countryOfManufacture,
          manufacturer: manufacturer,
          textile: textile,
          precaution: precaution,
          colorItems: colorItems,
        }),
      }
    );
    const simpleRes: SimpleResponseType = await response.json();
    
  }

  function changeIsActiveColorUls(index: number) {
    setIsActiveColorUls((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index]; // 현재 인덱스만 토글
      return newState;
    });
  }

  function changeSelectedColorIds(index: number, colorId: number) {
    setSelectedColorIds((prev) => {
      const newSelectedColorIds = [...prev];
      newSelectedColorIds[index] = colorId; // 해당 인덱스에 값 설정
      return newSelectedColorIds;
    });
  }

  return (
    <article className="grow">
      <div className="font-bold text-xl text-center p-3">상품 등록</div>

      <section className="divide-y-2">
        <section className="grid grid-cols-2 gap-x-10">
          {/* 상품 정보 */}
          <section className="grow ">
            <div className="font-bold text-2xl p-[1%] border-b">상품 정보</div>
            <div className="p-[2%] space-y-3 max-w-[50rem]">
              <div className="flex items-center">
                <label htmlFor="itemName" className="w-32 whitespace-nowrap">
                  상품명
                </label>
                <input
                  id="itemName"
                  type="text"
                  className="border p-3 grow"
                  placeholder="상품명"
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                />
              </div>

              <div className="flex items-center flex-wrap gap-y-3">
                <label htmlFor="category" className="w-32 whitespace-nowrap">
                  카테고리
                </label>
                <span className="flex flex-col bg-white grow">
                  <button
                    className="p-3 border text-left"
                    onClick={() => setIsActiveCategoryUl(!isActiveCategoryUl)}
                  >
                    {selectedCategoryId
                      ? categoryMap?.get(selectedCategoryId)
                      : "카테고리 선택"}
                  </button>

                  {isActiveCategoryUl && (
                    <ul className="border space-y-1 relative z-1 bg-white px-4 whitespace-nowrap divide-y-2 cursor-pointer">
                      {categories.map((category, index) => (
                        <li
                          onClick={(event) => {
                            setSelectedCategoryId(category.id);
                          }}
                          key={`category-${index}`}
                        >
                          {category.name}
                          <ul>
                            {category.children.map((child, index) => (
                              <li
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCategoryId(child.id);
                                }}
                                className="text-right"
                                key={`child-${index}`}
                              >
                                {child.name}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </span>
              </div>

              <div className="flex items-center">
                <label htmlFor="price" className="w-32 whitespace-nowrap">
                  가격
                </label>
                <input
                  id="price"
                  type="text"
                  className="border p-3 grow"
                  placeholder="가격"
                  value={price ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setPrice(value == "" ? undefined : Number(value));
                  }}
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="discountedPrice"
                  className="w-32 whitespace-nowrap"
                >
                  할인된 가격
                </label>
                <input
                  id="discountedPrice"
                  type="text"
                  className="border p-3 grow"
                  placeholder="할인된 가격"
                  value={discountedPrice ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                    setDiscountedPrice(Number(value));
                  }}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="gender" className="w-32 whitespace-nowrap">
                  성별
                </label>
                <div className="flex gap-x-3">
                  <button
                    onClick={() => setGender("BOTH")}
                    className={`text-nowrap border p-3 ${
                      gender === "BOTH" ? "bg-black text-white" : ""
                    }`}
                  >
                    공용
                  </button>
                  <button
                    onClick={() => setGender("MALE")}
                    className={`text-nowrap border p-3 ${
                      gender === "MALE" ? "bg-black text-white" : ""
                    }`}
                  >
                    남성
                  </button>
                  <button
                    onClick={() => setGender("FEMALE")}
                    className={`text-nowrap border p-3 ${
                      gender === "FEMALE" ? "bg-black text-white" : ""
                    }`}
                  >
                    여성
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 상품 상세정보 */}
          <section className="grow ">
            <div className="font-bold text-2xl p-[1%] border-b">
              상품 상세정보
            </div>
            <div className="p-[2%] space-y-3 max-w-[50rem]">
              <div className="flex items-center">
                <label htmlFor="description" className="w-32">
                  설명
                </label>
                <input
                  id="description"
                  type="text"
                  className="border p-3 grow"
                  placeholder="설명"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="yearSeason" className="w-32">
                  년도/시즌
                </label>
                <input
                  id="yearSeason"
                  type="text"
                  className="border p-3 grow"
                  placeholder="24 F/W"
                  value={yearSeason}
                  onChange={(event) => setYearSeason(event.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="dateOfManufacture" className="w-32">
                  제조연월
                </label>
                <input
                  id="dateOfManufacture"
                  type="text"
                  className="border p-3 grow"
                  placeholder="YYYY-MM-DD"
                  value={dateOfManufacture}
                  onChange={(event) => setDateOfManufacture(event.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="countryOfManufacture" className="w-32">
                  제조국
                </label>
                <input
                  id="countryOfManufacture"
                  type="text"
                  className="border p-3 grow"
                  placeholder="제조국"
                  value={countryOfManufacture}
                  onChange={(event) =>
                    setCountryOfManufacture(event.target.value)
                  }
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="manufacturer" className="w-32">
                  제조자/수입자
                </label>
                <input
                  id="manufacturer"
                  type="text"
                  className="border p-3 grow"
                  placeholder="제조자/수입자"
                  value={manufacturer}
                  onChange={(event) => setManufacturer(event.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="textile" className="w-32">
                  소재
                </label>
                <input
                  id="textile"
                  type="text"
                  className="border p-3 grow"
                  placeholder="소재"
                  value={textile}
                  onChange={(event) => setTextile(event.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="precaution" className="w-32">
                  취급 시 주의사항
                </label>
                <input
                  id="precaution"
                  type="text"
                  className="border p-3 grow"
                  placeholder="취급 시 주의사항"
                  value={precaution}
                  onChange={(event) => setPrecaution(event.target.value)}
                />
              </div>
            </div>
          </section>
        </section>

        <section className="grid grid-cols-2 gap-x-10">
          {/* 색상 & 이미지*/}
          <section>
            <div className="font-bold text-2xl p-[1%] border-b">
              색상 & 이미지
            </div>
            <button
              onClick={() => {
                setSelectedColorIds((prev) => [...prev, undefined]);
              }}
              className="border p-3"
            >
              색상 추가
            </button>
            {selectedColorIds.map((selectedColorId, index) => (
              <div
                className="p-[2%] space-y-3 max-w-[50rem]"
                key={`selectedColorId-${index}`}
              >
                <div className="flex items-center flex-wrap gap-y-3">
                  <label htmlFor="" className="w-32 whitespace-nowrap">
                    색상{index + 1}
                  </label>
                  <span className="flex flex-col bg-white grow">
                    <button
                      className="p-3 border text-left"
                      onClick={() => changeIsActiveColorUls(index)}
                    >
                      {selectedColorId
                        ? colorMap?.get(selectedColorId)
                        : "색상 선택"}
                    </button>

                    {isActiveColorUls[index] && (
                      <ul className="border space-y-1 relative z-1 bg-white px-4 whitespace-nowrap divide-y-2 cursor-pointer">
                        {colors.map((color, selfIndex) => (
                          <li
                            key={`parentColor${selfIndex}`}
                            onClick={() => {
                              changeIsActiveColorUls(index);
                              changeSelectedColorIds(index, color.id);
                            }}
                          >
                            {color.name}
                            <ul>
                              {color.children.map((child, selfIndex) => (
                                <li
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    changeIsActiveColorUls(index);
                                    changeSelectedColorIds(index, child.id);
                                  }}
                                  className="text-right"
                                  key={`childColor-${selfIndex}`}
                                >
                                  {child.name}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>

                  <div className="flex items-center">
                    <label htmlFor="gender" className="w-32 whitespace-nowrap">
                      상품 이미지
                    </label>
                    <input type="file" accept="image/*" multiple />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 사이즈 */}
          <section>
            <div className="font-bold text-2xl p-[1%] border-b">사이즈</div>
            <button
              onClick={() => {
                setSizes((prev) => [...prev, ""]);
              }}
              className="border p-3"
            >
              사이즈 추가
            </button>
            {sizes.map((size, index) => (
              <div
                className="p-[2%] space-y-3 max-w-[50rem]"
                key={`selectedColorId-${index}`}
              >
                <div className="flex items-center flex-wrap gap-y-3">
                  <label htmlFor="" className="w-32 whitespace-nowrap">
                    사이즈{index + 1}
                  </label>
                  <input
                    type="text"
                    placeholder="S(100)"
                    className="border p-3"
                    value={size}
                    onChange={(event) =>
                      setSizes((prev) => {
                        const newSizes = [...prev];
                        newSizes[index] = event.target.value;
                        return newSizes;
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </section>
        </section>

        {/*재고 */}
        <section>
          <div className="font-bold text-2xl p-[1%] border-b">재고</div>

          {selectedColorIds.map((selectedColorId, index) => (
            <div className="border-b p-3" key={`selectedColorIds-${index}`}>
              <div>
                {selectedColorId ? colorMap?.get(selectedColorId) : "색상 미정"}
              </div>

              <div className="flex gap-x-3">
                {sizes.map((size, sizeIndex) => (
                  <div className="" key={`size-${sizeIndex}`}>
                    <div className="flex items-center flex-wrap gap-3">
                      <label htmlFor="" className=" whitespace-nowrap">
                        {size ? size : "사이즈 미정"}
                      </label>
                      <input
                        type="text"
                        className="border p-3"
                        placeholder={size ? `${size} 재고` : `재고`}
                        onChange={(event) => {
                          // setStocks 함수가 재고 값을 업데이트하도록 해야 합니다.
                          setStocks((prevStocks) => {
                            // 새로운 재고 값을 입력한 경우, prevStocks에서 적절히 변경할 항목을 찾아 업데이트합니다.
                            const updatedStocks = [...prevStocks];
                            updatedStocks[index] = updatedStocks[index] || []; // index에 맞는 항목이 없으면 빈 배열로 초기화
                            updatedStocks[index][sizeIndex] = Number(
                              event.target.value
                            ); // 해당 색상 및 사이즈에 대한 재고 업데이트
                            return updatedStocks;
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button onClick={saveItem} className="bg bg-black text-white border p-3">
              상품 등록
            </button>
          </div>
        </section>
      </section>
    </article>
  );
};
