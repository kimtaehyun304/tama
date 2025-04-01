import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  isOpenMemberAddresskModal: boolean;
  setIsOpenMemberAddressModal: Dispatch<SetStateAction<boolean>>;
  setReceiverNickname: Dispatch<SetStateAction<string>>;
  setReceiverPhone: Dispatch<SetStateAction<string>>;
  setZoneCode: Dispatch<SetStateAction<number | undefined>>;
  setStreetAddress: Dispatch<SetStateAction<string>>;
  setDetailAddress: Dispatch<SetStateAction<string>>;
  setAddressName: Dispatch<SetStateAction<string>>;
  addresses: AddressResponse[];
  setHasAddress: Dispatch<SetStateAction<boolean>>;
};

export default ({
  isOpenMemberAddresskModal,
  setIsOpenMemberAddressModal,
  setReceiverNickname,
  setReceiverPhone,
  setZoneCode,
  setStreetAddress,
  setDetailAddress,
  setAddressName,
  addresses,
  setHasAddress,
}: Props) => {
  //const [isOpen, setIsOpen] = useState(true); // 모달 상태 관리

  const handleClose = () => {
    setIsOpenMemberAddressModal(false); // 모달 닫기
  };

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(undefined); // 선택된 주소의 ID 상태

  function changeAddress(selectedAddressId: number) {
    const selectedAddress: AddressResponse = addresses.find(
      (address) => address.id == selectedAddressId
    )!;
    setAddressName(selectedAddress.name);
    setStreetAddress(selectedAddress.street);
    setDetailAddress(selectedAddress.detail);
    setZoneCode(Number(selectedAddress.zipCode));
    setReceiverNickname(selectedAddress.receiverNickname);
    setReceiverPhone(selectedAddress.receiverPhone);
  }

  function clearAddress() {
    setAddressName("");
    setStreetAddress("");
    setDetailAddress("");
    setZoneCode(undefined);
    setReceiverNickname("");
    setReceiverPhone("");
  }

  if (!isOpenMemberAddresskModal) return null; // 모달이 닫힌 상태라면 렌더링하지 않음

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <section className="space-y-4 grow">
          {addresses.length === 0 ? (
            <div className="text-center">등록된 배송지가 없습니다</div>
          ) : (
            <div className="">
              {/* Modal Header */}
              <div className="flex p-3">
                <div className="grow text-center">배송지 변경</div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                  onClick={handleClose} // 닫기 버튼 동작
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
              {addresses.map((address, index) => (
                <div
                  className="border-t last:border-b p-3 space-y-1"
                  key={`address-${index}`}
                >
                  <label className="flex gap-x-1 items-center">
                    <input
                      onChange={() => setSelectedAddressId(address.id)} // 라디오 버튼 클릭 시 선택된 주소 ID 갱신
                      checked={selectedAddressId === address.id}
                      className="accent-black w-5 h-5"
                      type="radio"
                      name="defaultAddress"
                      id={`label-${index}`}
                    />

                    <div className="font-bold ">{address.name}</div>
                    <div>{address.isDefault && `(기본 배송지)`}</div>
                  </label>
                  <div>
                    {address.receiverNickname} {address.receiverPhone}
                  </div>
                  <div>
                    ({address.zipCode}) {address.street} {address.detail}
                  </div>
                </div>
              ))}
              <div className="flex gap-x-3 mb-3 justify-center">
                <button
                  onClick={() => {
                    changeAddress(selectedAddressId!);
                    setIsOpenMemberAddressModal(false);
                  }}
                  className="bg-black text-white p-3 border"
                  disabled={selectedAddressId === undefined} // 선택된 주소가 없으면 버튼 비활성화
                >
                  배송지 적용
                </button>
                <button
                  onClick={() => {
                    clearAddress();
                    setHasAddress(false);
                  }}
                  className="p-3 border"
                >
                  새 배송지
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
    </article>
  );
};
