import { Dispatch, SetStateAction } from "react";

import { DaumPostcodeEmbed } from "react-daum-postcode";

type Props = {
  isOpenDaumAddressModal: boolean;
  setIsOpenDaumAddressModal: Dispatch<SetStateAction<boolean>>;
  setStreetAddress: (value: string) => void;
  setZoneCode: (value: number) => void;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
};

export default ({
  isOpenDaumAddressModal,
  setIsOpenDaumAddressModal,
  setStreetAddress,
  setZoneCode,
  setIsDisabled,
}: Props) => {
  const closeModal = () => {
    setIsOpenDaumAddressModal(false); // 모달 닫기
  };

  const handleComplete = (data: OnCompleteType) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      setStreetAddress(fullAddress);
      setZoneCode(Number(data.zonecode));
    }
    setIsDisabled(true);
    setIsOpenDaumAddressModal(false);
  };

  if (!isOpenDaumAddressModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="text-right p-2 pb-0">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
            onClick={closeModal} // 닫기 버튼 동작
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Modal Body */}
        <DaumPostcodeEmbed
          onComplete={handleComplete}
          style={{ height: 470 }}
        ></DaumPostcodeEmbed>
      </section>
    </article>
  );
};
