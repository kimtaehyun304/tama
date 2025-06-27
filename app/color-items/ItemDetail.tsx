
import { RefObject } from "react";

type Props = {
  colorItem: ColorItemType;
  itemDetailRef: RefObject<HTMLDivElement>;
  activeSection: string;
};

export default ({ colorItem, itemDetailRef, activeSection }: Props) => {
  return (
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
  );
};
