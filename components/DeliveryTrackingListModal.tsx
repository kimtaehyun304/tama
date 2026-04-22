"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  delivery: DeliveryResponse | null;
  couriers: CourierResponse[];
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  delivery,
  couriers,
}: Props) {
  const [courier, setCourier] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>(""); // ✅ string으로 변경
  const [trackingInfo, setTrackingInfo] =
    useState<DeliveryTrackingResponse | null>(null);

  const handleClose = () => {
    setIsOpenModal(false);
  };

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpenModal) {
      setCourier("");
      setTrackingNumber("");
      setTrackingInfo(null);
    }
  }, [isOpenModal]);

  useEffect(() => {
    if (!isOpenModal || !delivery) return;

    fetchTracking(delivery.courier, delivery.trackingNumber);
  }, [isOpenModal, delivery]);

  async function fetchTracking(courier: string, trackingNumber: string) {
    if (!courier || !trackingNumber?.trim()) {
      alert("운송장 번호가 등록되지 않았습니다");
      setIsOpenModal(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/delivery/tracking?courier=${courier}&trackingNumber=${trackingNumber}`,
      );

      const data: DeliveryTrackingResponse = await res.json();

      if (!res.ok) {
        alert(data.message);
        setIsOpenModal(false);
        return;
      }

      setTrackingInfo(data);
    } catch (e) {
      console.error(e);
      alert("배송 조회 실패");
      setIsOpenModal(false);
      return;
    }
  }

  if (!isOpenModal) return null;

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <section className="">
          {/* 헤더 */}
          <div className="flex p-3">
            <div className="grow text-center font-semibold">배송 조회</div>
            <button onClick={handleClose}>✕</button>
          </div>

          {/* 결과 */}
          {trackingInfo && (
            <div className="p-4 pt-0 text-sm">
              {/* 상단 */}
              <div className="mb-3 space-y-1">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24">운송장번호</span>
                  <span>{trackingInfo.invoiceNo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24">택배사</span>
                  <span>{trackingInfo.courierName}</span>
                </div>
              </div>

              {/* 테이블 */}
              <div className="border rounded overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-100 text-xs p-2 font-semibold">
                  <div>시간</div>
                  <div>현재 위치</div>
                  <div>배송 상태</div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {trackingInfo.trackingDetails?.map((item, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-3 p-2 text-xs ${
                        idx % 2 === 0 ? "bg-gray-50" : ""
                      }`}
                    >
                      <div>{item.timeString}</div>
                      <div>{item.where}</div>
                      <div>{item.kind}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                배송 정보 제공 : 스윗트래커
              </div>
            </div>
          )}
        </section>
      </section>
    </article>
  );
}
