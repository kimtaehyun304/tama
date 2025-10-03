import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type ItemSummaryFormProps = {
  register: UseFormRegister<ItemSummaryState>;
  watch: UseFormWatch<ItemSummaryState>;
  control: Control<ItemSummaryState>;
  setValue: UseFormSetValue<ItemSummaryState>;
};

export default ({
  register,
  watch,
  control,
  setValue,
}: ItemSummaryFormProps) => {
  const [isActiveCategoryUl, setIsActiveCategoryUl] = useState(false);
  const [categories, setCategories] = useState<FamilyCateogoryType[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<number, string>>();
  const selectedCategoryId = watch("selectedCategoryId");

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
  }, []);

  return (
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
            {...register("itemName")}
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
                      setValue("selectedCategoryId", category.id);
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
                            setValue("selectedCategoryId", child.id);
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
          <label htmlFor="originalPrice" className="w-32 whitespace-nowrap">
            가격
          </label>
          <input
            id="originalPrice"
            type="text"
            className="border p-3 grow"
            placeholder="가격"
            {...register("originalPrice", { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="nowPrice" className="w-32 whitespace-nowrap">
            할인된 가격
          </label>
          <input
            id="nowPrice"
            type="text"
            className="border p-3 grow"
            placeholder="할인된 가격"
            {...register("nowPrice", { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="gender" className="w-32 whitespace-nowrap">
            성별
          </label>
          <div className="flex gap-x-3">
            <Controller
              name="gender"
              control={control}
              defaultValue="BOTH"
              render={({ field }) => (
                <div className="flex gap-x-3">
                  {(["BOTH", "MALE", "FEMALE"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => field.onChange(g)}
                      className={`text-nowrap border p-3 ${
                        field.value === g ? "bg-black text-white" : ""
                      }`}
                    >
                      {g === "BOTH" ? "공용" : g === "MALE" ? "남성" : "여성"}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
