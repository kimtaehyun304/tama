import { useEffect, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

type ItemColorIdImageFormProps = {
  watch: UseFormWatch<ItemColorIdImageState>;
  setValue: UseFormSetValue<ItemColorIdImageState>;
  colorMap: Map<number, string>;
  setColorMap: React.Dispatch<React.SetStateAction<Map<number, string>>>;
};

export default ({
  watch,
  colorMap,
  setColorMap,
  setValue,
}: ItemColorIdImageFormProps) => {
  const [isActiveColorUls, setIsActiveColorUls] = useState<boolean[]>([]);
  const [colors, setColors] = useState<FamilyColorType[]>([]);

  function changeIsActiveColorUls(index: number) {
    setIsActiveColorUls((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index]; // 현재 인덱스만 토글
      return newState;
    });
  }

  function changeSelectedColorIds(index: number, colorId: number) {
    const prev = watch("selectedColorIds");
    const newSelectedColorIds = [...prev];
    newSelectedColorIds[index] = colorId;
    setValue("selectedColorIds", newSelectedColorIds);
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

    const updatedFiles = [...watch("files")]; // 기존 files 배열 복사

    // 현재 색상(index)에 해당하는 파일 배열이 없으면 빈 배열로 초기화
    if (!updatedFiles[index]) {
      updatedFiles[index] = [];
    }

    // 새로 선택된 이미지 파일들을 해당 색상의 파일 배열에 추가
    updatedFiles[index] = newFiles;

    setValue("files", updatedFiles); // RHF 상태 업데이트
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

  return (
    <section>
      <div className="font-bold text-2xl p-[1%]">색상 & 이미지</div>
      <button
        onClick={() => {
          const updated = [...watch("selectedColorIds"), undefined];
          setValue("selectedColorIds", updated);
        }}
        className="border p-3"
      >
        색상 추가
      </button>
      {watch("selectedColorIds").map((selectedColorId, index) => (
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
                {selectedColorId ? colorMap?.get(selectedColorId) : "색상 선택"}
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
  );
};
