"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import DaumAddressModal from "@/components/modal/DaumAddressModal";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default () => {
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);

  const {
    register: addressFormRegister,
    watch: addressFormWatch,
    setValue: addressFormSetValue,
  } = useForm<AddressFormState>({
    defaultValues: {
      receiverNickname: "",
      receiverPhone: "",
      zoneCode: undefined,
      streetAddress: "",
      detailAddress: "",
      addressName: "",
    },
  });

  const [isDisabled, setIsDisabled] = useState(false);

  const [isOpenDaumAddressModal, setIsOpenDaumAddressModal] =
    useState<boolean>(false);

  async function saveAddress() {
    if (!validateForm()) return;
    if (authContext?.isLogined) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          //객체 단축 표기법
          body: JSON.stringify({
            addressName: addressFormWatch("addressName"),
            receiverNickname: addressFormWatch("receiverNickname"),
            receiverPhone: addressFormWatch("receiverPhone"),
            zipCode: addressFormWatch("zoneCode"),
            streetAddress: addressFormWatch("streetAddress"),
            detailAddress: addressFormWatch("detailAddress"),
          }),
        }
      );
      const simpleRes: SimpleResponseType = await res.json();
      simpleModalContext?.setMessage(simpleRes.message);
      simpleModalContext?.setIsOpenSimpleModal(true);
    } else {
      alert("로그인 해주세요");
    }
  }

  function validateForm(): boolean {
    const addressName = addressFormWatch("addressName");
    const receiverNickname = addressFormWatch("receiverNickname");
    const receiverPhone = addressFormWatch("receiverPhone");
    const zoneCode = addressFormWatch("zoneCode");
    const streetAddress = addressFormWatch("streetAddress");

    function activeModal(message: string) {
      simpleModalContext?.setMessage(message);
      simpleModalContext?.setIsOpenSimpleModal(true);
    }

    if (addressName == "") {
      activeModal("배송지명을 입력해주세요");
      return false;
    }

    if (!receiverNickname) {
      activeModal("받으시는 분 이름을 입력해주세요");
      return false;
    }

    if (!receiverPhone) {
      activeModal("전화번호를 입력해주세요");
      return false;
    }

    if (!/^[0-9]{10,11}$/.test(receiverPhone)) {
      activeModal("전화번호는 10~11자리 숫자만 가능합니다");
      return false;
    }

    if (!zoneCode) {
      activeModal("우편번호를 입력해주세요");
      return false;
    }

    if (!streetAddress) {
      activeModal("도로명 주소를 입력해주세요");
      return false;
    }

    return true;
  }

  return (
    <section>
      <div className="font-bold text-2xl p-[1%] border-b">받는고객</div>
      <div className="p-[2%] space-y-3 max-w-[50rem]">
        <div className="flex items-center">
          <label htmlFor="receiverNickname" className="w-32 whitespace-nowrap">
            배송지명
          </label>
          <input
            id="receiverNickname"
            type="text"
            className="border p-3 grow"
            placeholder="배송지명"
            {...addressFormRegister("addressName")}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="receiverNickname" className="w-32 whitespace-nowrap">
            이름
          </label>
          <input
            id="receiverNickname"
            type="text"
            className="border p-3 grow"
            placeholder="받으시는 분"
            {...addressFormRegister("receiverNickname")}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="receiverPhone" className="w-32">
            휴대폰 번호
          </label>
          <input
            id="receiverPhone"
            type="text"
            className="border p-3 grow"
            placeholder="숫자만 입력하세요"
            {...addressFormRegister("receiverPhone")}
          />
        </div>

        <div className="flex items-center flex-wrap gap-y-3">
          <label htmlFor="zoneCode" className="w-32 whitespace-nowrap">
            우편번호
          </label>
          <input
            id="zoneCode"
            type="text"
            className="border p-3 grow"
            placeholder="우편번호"
            {...addressFormRegister("zoneCode", {
              onChange: (e) => {
                // 숫자만 입력되도록 필터링
                const onlyNumber = e.target.value.replace(/\D/g, "");
                addressFormSetValue(
                  "zoneCode",
                  onlyNumber === "" ? undefined : Number(onlyNumber),
                  { shouldValidate: true }
                );
              },
            })}
            disabled={isDisabled}
          />

          <button
            className="border p-3 ml-auto"
            onClick={() => {
              setIsOpenDaumAddressModal(true);
            }}
          >
            우편번호 찾기
          </button>
        </div>

        <DaumAddressModal
          isOpenDaumAddressModal={isOpenDaumAddressModal}
          setIsOpenDaumAddressModal={setIsOpenDaumAddressModal}
          setStreetAddress={(value: string) =>
            addressFormSetValue("streetAddress", value)
          }
          setZoneCode={(value: number) =>
            addressFormSetValue("zoneCode", value)
          }
          setIsDisabled={setIsDisabled}
        />

        <div className="flex items-center flex-wrap gap-y-3">
          <label htmlFor="streetAddress" className="w-32 whitespace-nowrap">
            도로명주소
          </label>
          <input
            id="streetAddress"
            type="text"
            className="border p-3 grow"
            placeholder="도로명주소"
            {...addressFormRegister("streetAddress")}
            disabled={isDisabled}
          />
        </div>

        <div className="flex items-center flex-wrap gap-y-3">
          <label htmlFor="detailAddress" className="w-32 whitespace-nowrap">
            상세주소
          </label>
          <input
            id="detailAddress"
            type="text"
            className="border p-3 grow"
            placeholder="상세주소"
            {...addressFormRegister("detailAddress")}
          />
        </div>

        <button
          onClick={saveAddress}
          className="bg-black text-white p-3 border"
        >
          배송지 등록
        </button>
      </div>
    </section>
  );
};
