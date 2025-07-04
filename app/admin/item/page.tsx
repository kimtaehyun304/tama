"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import ForbiddenScreen from "@/components/ForbiddenScreen";
import React, { useContext, useEffect, useState } from "react";
import MenuList from "../MenuList";
import ItemSummaryForm from "./ItemSummaryForm";
import ItemDetailForm from "./ItemDetailForm";
import { useForm } from "react-hook-form";

export default () => {
  const {
    register: itemSummaryRegister,
    watch: itemSummaryWatch,
    control: itemSummaryControl,
  } = useForm<ItemSummaryState>({
    defaultValues: {
      itemName: "",
      selectedCategoryId: undefined,
      price: undefined,
      discountedPrice: undefined,
      gender: "BOTH",
    },
  });

  const { register: itemDetailRegister, watch: itemDetailWatch } =
    useForm<ItemDetailState>({
      defaultValues: {
        yearSeason: "",
        description: "",
        dateOfManufacture: "",
        countryOfManufacture: "",
        manufacturer: "",
        textile: "",
        precaution: "",
      },
    });

  const simpleModalContext = useContext(SimpleModalContext);
  const [colors, setColors] = useState<FamilyColorType[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<
    (number | undefined)[]
  >([undefined]);

  const [sizes, setSizes] = useState<string[]>([""]);

  const [isActiveColorUls, setIsActiveColorUls] = useState<boolean[]>([]);

  const [colorMap, setColorMap] = useState<Map<number, string>>();
  const [files, setFiles] = useState<File[][]>([]);
  const [stocks, setStocks] = useState<number[][]>([]);
  const authContext = useContext(AuthContext);

  async function saveItem() {
    function validateForm() {
      const itemName = itemSummaryWatch("itemName");
      const price = itemSummaryWatch("price");
      const discountedPrice = itemSummaryWatch("discountedPrice");
      const gender = itemSummaryWatch("gender");
      const selectedCategoryId = itemSummaryWatch("selectedCategoryId");

      const yearSeason = itemDetailWatch("yearSeason");
      const description = itemDetailWatch("description");
      const dateOfManufacture = itemDetailWatch("dateOfManufacture");
      const countryOfManufacture = itemDetailWatch("countryOfManufacture");
      const manufacturer = itemDetailWatch("manufacturer");
      const textile = itemDetailWatch("textile");
      const precaution = itemDetailWatch("precaution");

      if (!itemName) {
        alert("상품명을 입력해주세요.");
        return false;
      }

      if (!price || price <= 0) {
        alert("가격을 올바르게 입력해주세요.");
        return false;
      }

      if (discountedPrice !== undefined && discountedPrice < 0) {
        alert("할인 가격은 0 이상이어야 합니다.");
        return false;
      }

      if (!["BOTH", "MALE", "FEMALE"].includes(gender)) {
        alert("성별을 올바르게 선택해주세요.");
        return false;
      }

      if (!yearSeason) {
        alert("연도/시즌을 입력해주세요.");
        return false;
      }

      if (!description) {
        alert("설명을 입력해주세요.");
        return false;
      }

      if (!dateOfManufacture) {
        alert("제조일자를 입력해주세요.");
        return false;
      }

      if (!countryOfManufacture) {
        alert("제조국을 입력해주세요.");
        return false;
      }

      if (!manufacturer) {
        alert("제조사를 입력해주세요.");
        return false;
      }

      if (!selectedCategoryId) {
        alert("카테고리를 선택해주세요.");
        return false;
      }

      if (!selectedColorIds || selectedColorIds.includes(undefined)) {
        alert("색상을 선택해주세요.");
        return false;
      }

      if (!sizes.length || sizes.some((size) => !size)) {
        alert("사이즈를 입력해주세요.");
        return false;
      }

      if (!textile) {
        alert("원단 정보를 입력해주세요.");
        return false;
      }

      if (!precaution) {
        alert("주의사항을 입력해주세요.");
        return false;
      }

      if (!files.length || files.some((fileArr) => fileArr.length === 0)) {
        alert("이미지 파일을 선택해주세요.");
        return false;
      }

      if (
        !stocks.length ||
        stocks.some((stockArr) =>
          stockArr.some((stock) => isNaN(stock) || stock < 0)
        )
      ) {
        alert("재고 정보를 올바르게 입력해주세요. (0 이상의 숫자만 허용)");
        return false;
      }

      return true;
    }
    if (!validateForm()) return;

    // colorItems 구성
    const colorItems = selectedColorIds.map((colorId, colorIndex) => ({
      colorId,
      sizeStocks: sizes.map((size, sizeIndex) => ({
        size,
        stock: stocks[colorIndex]?.[sizeIndex] ?? 0,
      })),
    }));

    // 상품 저장 API 호출
    const savedItemRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
        },
        body: JSON.stringify({
          name: itemSummaryWatch("itemName"),
          categoryId: itemSummaryWatch("selectedCategoryId"),
          price: itemSummaryWatch("price"),
          discountedPrice: itemSummaryWatch("discountedPrice"),
          gender: itemSummaryWatch("gender"),
          description: itemDetailWatch("description"),
          yearSeason: itemDetailWatch("yearSeason"),
          dateOfManufacture: itemDetailWatch("dateOfManufacture"),
          countryOfManufacture: itemDetailWatch("countryOfManufacture"),
          manufacturer: itemDetailWatch("manufacturer"),
          textile: itemDetailWatch("textile"),
          precaution: itemDetailWatch("precaution"),
          colorItems,
        }),
      }
    );

    if (!savedItemRes.ok) {
      alert("상품 저장에 실패했습니다.");
      return;
    }

    // 이미지 업로드
    const savedColorItemIdJson: SavedColorItemIdResponse =
      await savedItemRes.json();

    const formData = new FormData();
    savedColorItemIdJson.savedColorItemIds.forEach(
      (savedColorItemId, index) => {
        if (savedColorItemId) {
          formData.append(
            `requests[${index}].colorItemId`,
            savedColorItemId.toString()
          );
        }
        files[index]?.forEach((file) => {
          formData.append(`requests[${index}].files`, file);
        });
      }
    );

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

    if (!savedImageRes.ok) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    const savedImageJson: SimpleResponseType = await savedImageRes.json();
    simpleModalContext?.setMessage(savedImageJson.message);
    simpleModalContext?.setIsOpenSimpleModal(true);
  }

  useEffect(() => {
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

  if (!authContext?.isLogined) return <ForbiddenScreen />;

  return (
    <article className="xl:mx-32 m-[2%] flex flex-wrap gap-x-16 gap-y-4 justify-center xl:justify-start">
      {authContext?.isLogined && <MenuList />}
      <article className="grow">
        <div className="font-bold text-xl text-center p-3">상품 등록</div>

        <section className="flex flex-wrap gap-x-10">
          <ItemSummaryForm
            register={itemSummaryRegister}
            watch={itemSummaryWatch}
            control={itemSummaryControl}
          />
          <ItemDetailForm register={itemDetailRegister} />
        </section>

        {/* 색상 & 이미지 & 사이즈*/}
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
              <React.Fragment key={`selectedColorId-${index}`}>
                <label className="flex items-center flex-wrap gap-y-3 p-3">
                  <div className="w-32">{`사이즈${index + 1}`}</div>
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
                </label>
              </React.Fragment>
            ))}
          </section>
        </section>

        {/*재고 */}
        <section>
          <div className="font-bold text-2xl p-[1%] ">재고</div>

          {selectedColorIds.map((selectedColorId, index) => (
            <React.Fragment key={`selectedColorIds-${index}`}>
              {sizes.map((size, sizeIndex) => (
                <React.Fragment key={`size-${sizeIndex}`}>
                  <label className="flex items-center flex-wrap gap-3 border-b p-3">
                    <div>
                      {`${
                        selectedColorId
                          ? colorMap?.get(selectedColorId)
                          : "색상 미정"
                      } / ${size || "사이즈 미정"}`}
                    </div>

                    <input
                      type="number"
                      min="1"
                      className="border p-3"
                      placeholder={"재고"}
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
                  </label>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}

          <button
            onClick={saveItem}
            className="bg-black text-white border p-3 block mx-auto"
          >
            상품 등록
          </button>
        </section>
      </article>
    </article>
  );
};
