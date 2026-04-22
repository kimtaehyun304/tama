import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  delivery: DeliveryResponse | null;
  couriers: CourierResponse[];
  updateDeliveryState: (
    deliveryId: number,
    courier: string,
    trackingNumber: string,
  ) => void;
};

export default function ({
  isOpenModal,
  setIsOpenModal,
  delivery,
  couriers,
  updateDeliveryState,
}: Props) {
  const [selectedCourier, setSelectedCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleClose = () => {
    setIsOpenModal(false);
  };

  /* 없어도 무방
  // ✅ 1. 모달 열릴 때 초기화 (이전 값 방지)
  useEffect(() => {
    if (isOpenModal) {
      setSelectedCourier("");
      setTrackingNumber("");
    }
  }, [isOpenModal]);
  */

  // ✅ 3. 기존 운송장 값 세팅 (핵심)
  useEffect(() => {
    if (!isOpenModal || !delivery) return;

    // courier 매칭 (eng 기준)
    setSelectedCourier(delivery.courier ?? "");
    setTrackingNumber(delivery.trackingNumber ?? "");
  }, [isOpenModal, delivery]);

  // ✅ 저장
  async function changeDelivetyTracking() {
    if (!selectedCourier || !trackingNumber) {
      alert("택배사와 운송장 번호를 입력하세요.");
      return;
    }

    const payload = {
      courier: selectedCourier,
      trackingNumber: trackingNumber,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/delivery/${delivery?.id}/tracking`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "서버 에러");
      }

      updateDeliveryState(delivery!.id, selectedCourier, trackingNumber);

      alert("저장 완료");
      setIsOpenModal(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "저장 중 오류가 발생했습니다.");
    }
  }

  if (!isOpenModal) return null;

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <section className="space-y-4 grow">
          {/* 헤더 */}
          <div className="flex p-3">
            <div className="grow text-center font-semibold">운송장 등록</div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>

          {/* 내용 */}
          <section>
            <div className="p-[2%] space-y-3 max-w-[50rem]">
              {/* 택배사 */}
              <div className="flex items-center">
                <label htmlFor="carrierCode" className="w-32 whitespace-nowrap">
                  택배 회사
                </label>

                <select
                  id="carrierCode"
                  className="border p-3 grow"
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                >
                  <option value="" disabled>
                    택배사 선택
                  </option>

                  {couriers.map((c) => (
                    <option key={c.eng} value={c.eng}>
                      {c.kor}
                    </option>
                  ))}
                </select>
              </div>

              {/* 운송장 번호 */}
              <div className="flex items-center">
                <label htmlFor="trackingNumber" className="w-32">
                  운송장 번호
                </label>
                <input
                  id="trackingNumber"
                  type="text"
                  className="border p-3 grow"
                  placeholder="운송장 번호"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 버튼 */}
          <div className="flex gap-x-3 mb-3 justify-center">
            <button
              onClick={changeDelivetyTracking}
              className="bg-black text-white p-3 border"
            >
              저장
            </button>
          </div>
        </section>
      </section>
    </article>
  );
}
