import { UseFormRegister } from "react-hook-form";

type ItemDetailFormProps = {
  register: UseFormRegister<ItemDetailState>;
};

export default ({ register }: ItemDetailFormProps) => {
  return (
    <section className="grow">
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
            {...register("description")}
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
            {...register("yearSeason")}
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
            {...register("dateOfManufacture")}
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
            {...register("countryOfManufacture")}
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
            {...register("manufacturer")}
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
            {...register("textile")}
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
            {...register("precaution")}
          />
        </div>
      </div>
    </section>
  );
};
