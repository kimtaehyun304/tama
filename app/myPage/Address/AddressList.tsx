"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";

export default () => {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  ); // 선택된 주소의 ID 상태
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);

  // 주소 목록을 가져오는 useEffect
  useEffect(() => {
    async function fetchAddress() {
      if (authContext?.isLogined) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/address`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("tamaAccessToken"),
            },
          }
        );
        const addressesJson: AddressResponse[] = await res.json();
        setAddresses(addressesJson);

        // 기본 배송지 주소가 있으면 선택된 주소로 설정
        const defaultAddress = addressesJson.find(
          (address) => address.isDefault
        );

        defaultAddress && setSelectedAddressId(defaultAddress.id);
      }
    }
    fetchAddress();
  }, [authContext?.isLogined]);

  // 기본 배송지 업데이트 함수
  async function updateDefaultAddress(selectedAddressId: number) {
    if (authContext?.isLogined && selectedAddressId !== null) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/address/default`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          body: JSON.stringify({ addressId: selectedAddressId }), // 선택된 주소 ID를 요청 본문에 담아 보냄
        }
      );
      const addressesJson: SimpleResponseType = await res.json();
      simpleModalContext?.setMessage(addressesJson.message);
      simpleModalContext?.setIsOpenSimpleModal(true);

      // 기본 배송지 설정 후 주소 목록 갱신
      const updatedAddresses = await fetchAddresses();
      setAddresses(updatedAddresses);
    }
  }

  // 주소 목록을 다시 가져오는 함수
  async function fetchAddresses() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/address`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
        },
      }
    );
    return await res.json();
  }

  return (
    <section className="space-y-4 grow">
      {addresses.length === 0 ? (
        <div className="text-center">등록된 배송지가 없습니다</div>
      ) : (
        <div className="">
          {/* 기본 배송지 설정 버튼은 라디오 버튼 선택 시 활성화 */}
          <div className="text-center">
            <button
              onClick={() => updateDefaultAddress(selectedAddressId!)} // 선택된 주소 ID를 넘겨줌
              className="bg-black text-white p-3 my-6"
              disabled={selectedAddressId === null} // 선택된 주소가 없으면 버튼 비활성화
            >
              기본 배송지 설정
            </button>
          </div>

          {addresses.map((address, index) => (
            <div
              className="border-t last:border-b p-3 space-y-1"
              key={`address-${index}`}
            >
              <div className="flex gap-x-1">
                <input
                  className="accent-black w-10"
                  type="radio"
                  name="defaultAddress"
                  id={`label-${index}`}
                  checked={selectedAddressId === address.id} // 선택된 주소의 ID와 일치하는지 확인
                  onChange={() => setSelectedAddressId(address.id)} // 라디오 버튼 클릭 시 선택된 주소 ID 갱신
                />
                <label className="font-bold" htmlFor={`label-${index}`}>
                  {address.name}
                </label>
                <div>{address.isDefault && `(기본 배송지)`}</div>
              </div>
              <div>
                {address.receiverNickname} {address.receiverPhone}
              </div>
              <div>
                ({address.zipCode}) {address.street} {address.detail}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
