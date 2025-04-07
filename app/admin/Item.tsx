"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { useContext, useEffect, useState } from "react";

export default () => {

  const simpleModalContext = useContext(SimpleModalContext);


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
  const [files, setFiles] = useState<File[][]>([]);
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

  function validateForm() {
    // itemName이 비어있으면 경고
    if (!itemName) {
      alert("상품명을 입력해주세요.");
      return false;
    }

    // price가 없거나 0 이하이면 경고
    if (!price || price <= 0) {
      alert("가격을 올바르게 입력해주세요.");
      return false;
    }

    // discountedPrice가 있을 때, 0 이상이어야 함
    if (discountedPrice !== undefined && discountedPrice < 0) {
      alert("할인 가격은 0 이상이어야 합니다.");
      return false;
    }

    // gender가 올바른 값인지 확인
    if (!["BOTH", "MALE", "FEMALE"].includes(gender)) {
      alert("성별을 올바르게 선택해주세요.");
      return false;
    }

    // yearSeason이 비어있으면 경고
    if (!yearSeason) {
      alert("연도/시즌을 입력해주세요.");
      return false;
    }

    // description이 비어있으면 경고
    if (!description) {
      alert("설명을 입력해주세요.");
      return false;
    }

    // dateOfManufacture가 비어있으면 경고
    if (!dateOfManufacture) {
      alert("제조일자를 입력해주세요.");
      return false;
    }

    // countryOfManufacture가 비어있으면 경고
    if (!countryOfManufacture) {
      alert("제조국을 입력해주세요.");
      return false;
    }

    // manufacturer가 비어있으면 경고
    if (!manufacturer) {
      alert("제조사를 입력해주세요.");
      return false;
    }

    // selectedCategoryId가 없으면 경고
    if (!selectedCategoryId) {
      alert("카테고리를 선택해주세요.");
      return false;
    }

    // 선택된 색상이 없으면 경고
    if (!selectedColorIds || selectedColorIds.includes(undefined)) {
      alert("색상을 선택해주세요.");
      return false;
    }

    // 사이즈가 비어있으면 경고
    if (!sizes.length || sizes.some((size) => !size)) {
      alert("사이즈를 입력해주세요.");
      return false;
    }

    // textile이 비어있으면 경고
    if (!textile) {
      alert("원단 정보를 입력해주세요.");
      return false;
    }

    // precaution이 비어있으면 경고
    if (!precaution) {
      alert("주의사항을 입력해주세요.");
      return false;
    }

    // 파일이 비어있으면 경고
    if (!files.length || files.some((fileArr) => fileArr.length === 0)) {
      alert("이미지 파일을 선택해주세요.");
      return false;
    }

    // 재고가 비어있거나 숫자가 아닌 값이 있으면 경고
    if (
      !stocks.length ||
      stocks.some((stockArr) =>
        stockArr.some((stock) => isNaN(stock) || stock < 0)
      )
    ) {
      alert("재고 정보를 올바르게 입력해주세요. (0 이상의 숫자만 허용)");
      return false;
    }

    // 모든 검사를 통과하면 true 반환
    return true;
  }

  async function saveItem() {
    if (!validateForm()) return;

    const colorItems = selectedColorIds.map((selectedColorId, index) => {
      return {
        colorId: selectedColorId,
        //files: files[index],
        sizeStocks: sizes.map((size, sizeIndex) => ({
          size,
          stock: stocks[index]?.[sizeIndex] || 0, // stocks는 각 색상 및 사이즈에 대한 재고 정보를 담고 있어야 합니다.
        })),
      };
    });

    const savedItemRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
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

    //이미지 업로드
    if (savedItemRes.ok) {
      const savedColorItemIdJson: SavedColorItemIdResponse = await savedItemRes.json();

      const formData = new FormData();
      /*
      selectedColorIds.forEach((selectedColorId, index) => {
        if (selectedColorId)
          formData.append(
            `requests[${index}].colorItemId`,
            selectedColorId?.toString()
          );

        files[index]?.forEach((file) => {
          formData.append(`requests[${index}].files`, file);
        });
      });
      */
      savedColorItemIdJson.savedColorItemIds.forEach((savedColorItemId, index) => {
        if (savedColorItemId)
          formData.append(
            `requests[${index}].colorItemId`,
            savedColorItemId?.toString()
          );

        files[index]?.forEach((file) => {
          formData.append(`requests[${index}].files`, file);
        });
      });

      const savedImageRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/images/new`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          body: formData,
        }
      );

      const savedImageJson: SimpleResponseType = await savedImageRes.json();
      simpleModalContext?.setMessage(savedImageJson.message);
      simpleModalContext?.setIsOpenSimpleModal(true);
    }
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

  function changeFile(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    let newFiles = Array.from(selectedFiles);

    // 이미지가 아닌 파일이 하나라도 있으면, 바로 리턴
    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택할 수 있습니다.");
        event.target.value = "";
        newFiles = [];
      }
    }

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles]; // 기존 files 배열 복사

      // 현재 색상(index)에 해당하는 파일 배열이 없으면 빈 배열로 초기화
      if (!updatedFiles[index]) {
        updatedFiles[index] = [];
      }

      // 새로 선택된 이미지 파일들을 해당 색상의 파일 배열에 추가
      updatedFiles[index] = newFiles;

      return updatedFiles; // 업데이트된 배열 반환
    });
  }

  return (
    <article className="grow">
      <div className="font-bold text-xl text-center p-3">상품 등록</div>

      <section className="">
        <section className="flex flex-wrap gap-x-10">
          {/* 상품 정보 */}
          <section className="grow ">
            <div className="font-bold text-2xl p-[1%]">상품 정보</div>
            <div className="p-[2%] space-y-3">
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
                <span className="relative flex flex-col bg-white grow">
                  <button
                    className="p-3 border text-left"
                    onClick={() => setIsActiveCategoryUl(!isActiveCategoryUl)}
                  >
                    {selectedCategoryId
                      ? categoryMap?.get(selectedCategoryId)
                      : "카테고리 선택"}
                  </button>

                  {isActiveCategoryUl && (
                    <ul className="border space-y-1 absolute w-full z-1 bg-white p-3 whitespace-nowrap divide-y-2 cursor-pointer">
                      {categories.map((category, index) => (
                        <li
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setIsActiveCategoryUl(false);
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
                                  setIsActiveCategoryUl(false);
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
            <div className="font-bold text-2xl p-[1%]">상품 상세정보</div>
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

        <section className="flex flex-wrap gap-x-10">
          {/* 색상 & 이미지*/}
          <section>
            <div className="font-bold text-2xl p-[1%]">색상 & 이미지</div>
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
                  <span className="relative flex flex-col bg-white grow">
                    <button
                      className="p-3 border text-left"
                      onClick={() => changeIsActiveColorUls(index)}
                    >
                      {selectedColorId
                        ? colorMap?.get(selectedColorId)
                        : "색상 선택"}
                    </button>

                    {isActiveColorUls[index] && (
                      <ul className="border space-y-1 absolute w-full z-10 bg-white p-3 whitespace-nowrap divide-y-2 cursor-pointer">
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

                  <div className="flex flex-wrap items-center">
                    <label htmlFor="gender" className="w-32 whitespace-nowrap">
                      상품 이미지
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => changeFile(event, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 사이즈 */}
          <section>
            <div className="font-bold text-2xl p-[1%] ">사이즈</div>
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
          <div className="font-bold text-2xl p-[1%] ">재고</div>

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
                        type="number"
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
            <button
              onClick={saveItem}
              className="bg bg-black text-white border p-3"
            >
              상품 등록
            </button>
          </div>
        </section>
      </section>
    </article>
  );
};
