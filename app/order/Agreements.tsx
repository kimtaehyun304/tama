import { AuthContext } from "@/components/context/AuthContext";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { Dispatch, SetStateAction, useContext, useState } from "react";

const AGREEMENTS_STR = [
  "모두 동의",
  "비회원구매 개인정보 수집 및 이용동의",
  "만 14세 이상입니다",
];

type AgreementsProps = {
  isAgreed: boolean;
  setIsAgreed: Dispatch<SetStateAction<boolean>>;
};
export default ({ isAgreed, setIsAgreed }: AgreementsProps) => {
  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(AGREEMENTS_STR.length).fill(false)
  );

  const simpleModalContext = useContext(SimpleModalContext);
  const authContext = useContext(AuthContext);

  function check(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (index === 0)
      setIsChecked(Array(AGREEMENTS_STR.length).fill(event.target.checked));
    else {
      const newArr = [...isChecked];
      newArr[index] = event.target.checked;
      setIsChecked(newArr);
    }
  }

  function validateAgreement() {
    if (isChecked.slice(1).some((value) => value === false)) {
      simpleModalContext?.setMessage("약관에 동의해주세요");
      simpleModalContext?.setIsOpenSimpleModal(true);
    } else setIsAgreed(true);
  }

  if (authContext?.isLogined && !isAgreed)
    return (
      <section>
        <div className="text-center font-bold text-3xl py-9">
          비회원 주문 약관동의
        </div>
        <div className="flex justify-center">
          <div className="divide-y-2">
            {AGREEMENTS_STR.map((agreement, index) => (
              <div className="flex py-3" key={`agreement${index}`}>
                <input
                  type="checkbox"
                  className="w-7 h-7 accent-black"
                  id={`checkbox${index}`}
                  checked={isChecked[index]}
                  onChange={(event) => {
                    check(event, index);
                  }}
                />
                <label htmlFor={`checkbox${index}`} className="pl-2 text-xl">
                  {agreement}
                </label>
              </div>
            ))}
            <button
              className="border p-3 w-full bg-black text-white"
              onClick={validateAgreement}
            >
              약관동의
            </button>
          </div>
        </div>
      </section>
    );
};
