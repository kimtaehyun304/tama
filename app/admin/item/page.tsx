"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import React, { useContext, useState } from "react";
import ItemSummaryForm from "./ItemSummaryForm";
import ItemDetailForm from "./ItemDetailForm";
import { useForm } from "react-hook-form";
import ItemColorIdImageForm from "./ItemColorIdImageForm";

export default () => {
  const {
    register: itemSummaryRegister,
    watch: itemSummaryWatch,
    control: itemSummaryControl,
    setValue: itemSummarySetValue,
  } = useForm<ItemSummaryState>({
    defaultValues: {
      itemName: "",
      selectedCategoryId: undefined,
      originalPrice: undefined,
      nowPrice: undefined,
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

  const {
    watch: itemColorIdImageWatch,
    setValue: itemColorIdImageWatchSetValue,
  } = useForm<ItemColorIdImageState>({
    defaultValues: {
      selectedColorIds: [undefined],
      files: [],
    },
  });

  const simpleModalContext = useContext(SimpleModalContext);
  const [colorMap, setColorMap] = useState<Map<number, string>>(new Map());
  const [sizes, setSizes] = useState<string[]>([""]);
  const [stocks, setStocks] = useState<number[][]>([]);

  async function saveItem() {
    function validateForm() {
      const itemName = itemSummaryWatch("itemName");
      const originalPrice = itemSummaryWatch("originalPrice");
      const nowPrice = itemSummaryWatch("nowPrice");
      const gender = itemSummaryWatch("gender");
      const selectedCategoryId = itemSummaryWatch("selectedCategoryId");

      const yearSeason = itemDetailWatch("yearSeason");
      const description = itemDetailWatch("description");
      const dateOfManufacture = itemDetailWatch("dateOfManufacture");
      const countryOfManufacture = itemDetailWatch("countryOfManufacture");
      const manufacturer = itemDetailWatch("manufacturer");
      const textile = itemDetailWatch("textile");
      const precaution = itemDetailWatch("precaution");
      const selectedColorIds = itemColorIdImageWatch("selectedColorIds");
      const files = itemColorIdImageWatch("files");

      if (!itemName) {
        alert("상품명을 입력해주세요.");
        return false;
      }

      if (!originalPrice || originalPrice <= 0) {
        alert("가격을 올바르게 입력해주세요.");
        return false;
      }

      if (nowPrice !== undefined && nowPrice < 0) {
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
          stockArr.some((stock) => isNaN(stock) || stock < 0),
        )
      ) {
        alert("재고 정보를 올바르게 입력해주세요. (0 이상의 숫자만 허용)");
        return false;
      }

      return true;
    }
    if (!validateForm()) return;

    // colorItems 구성
    const colorItems = itemColorIdImageWatch("selectedColorIds").map(
      (colorId, colorIndex) => ({
        colorId,
        sizeStocks: sizes.map((size, sizeIndex) => ({
          size,
          stock: stocks[colorIndex]?.[sizeIndex] ?? 0,
        })),
      }),
    );

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
          originalPrice: itemSummaryWatch("originalPrice"),
          nowPrice: itemSummaryWatch("nowPrice"),
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
      },
    );

    if (savedItemRes.status !== 201) {
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
            savedColorItemId.toString(),
          );
        }
        itemColorIdImageWatch("files")[index]?.forEach((file) => {
          formData.append(`requests[${index}].files`, file);
        });
      },
    );

    const savedImageRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/images/new`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
        },
        body: formData,
      },
    );

    if (!savedImageRes.ok) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    const savedImageJson: SimpleResponseType = await savedImageRes.json();
    simpleModalContext?.setMessage(savedImageJson.message);
    simpleModalContext?.setIsOpenSimpleModal(true);
  }

  return (
    <article className="grow">
      <div className="font-bold text-xl text-center p-3">상품 등록</div>

      <section className="flex flex-wrap gap-x-10">
        <ItemSummaryForm
          register={itemSummaryRegister}
          watch={itemSummaryWatch}
          control={itemSummaryControl}
          setValue={itemSummarySetValue}
        />
        <ItemDetailForm register={itemDetailRegister} />
      </section>

      {/* 색상 & 이미지 & 사이즈*/}
      <section className="flex flex-wrap gap-x-10">
        {/* 색상 & 이미지*/}
        <ItemColorIdImageForm
          watch={itemColorIdImageWatch}
          colorMap={colorMap}
          setColorMap={setColorMap}
          setValue={itemColorIdImageWatchSetValue}
        />
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

        {itemColorIdImageWatch("selectedColorIds").map(
          (selectedColorId, index) => (
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
                            event.target.value,
                          ); // 해당 색상 및 사이즈에 대한 재고 업데이트
                          return updatedStocks;
                        });
                      }}
                    />
                  </label>
                </React.Fragment>
              ))}
            </React.Fragment>
          ),
        )}

        <button
          onClick={saveItem}
          className="bg-black text-white border p-3 block mx-auto"
        >
          상품 등록
        </button>
      </section>
    </article>
  );
};
