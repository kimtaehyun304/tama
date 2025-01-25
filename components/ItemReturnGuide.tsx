import React from "react";

interface StarRatingProps {
  rating: number; // 평점 (0 ~ 5 사이의 값, 소수점 포함)
  maxStars?: number; // 별의 최대 개수 (기본값: 5)
}

export default function ItemRetrunGuide() {
  return (
    <section className="">
      <div className="py-3">
        <div className="text-2xl font-bold pb-2">배송정보</div>
        <ul className="list-disc list-inside">
          <li>
            배송기간은 주문일(무통장입금은 결제완료일)로부터 평균 2일 ~ 3일정도
            소요되며, 예약 배송 상품의 경우는 예약 배송일 기준으로 적용됩니다.
          </li>
          <li>
            각인서비스 상품의 경우는 평균 배송 기간보다 10일 정도의 기간이 추가
            소요됩니다.
          </li>
        </ul>
      </div>

      <div className="py-3">
        <div className="text-2xl font-bold pb-2">취소 및 반품, 교환 안내</div>
        <ul className="list-disc list-inside">
          <li>
            주문취소는 상품준비중까지 가능합니다. (일부상품은 배송준비중까지
            취소 가능합니다)
          </li>
          <li>
            교환/반품 사유가 단순 변심 등 고객에게 귀책사유가 있는 경우,
            교환/반품 배송비는 고객님께서 부담하셔야 합니다.
          </li>
          <li>
            전자상거래 등에서 소비자보호에 관한 법률에 따라 다음의 경우
            청약철회가 제한될 수 있습니다
          </li>
        </ul>
      </div>

      <div className="py-3">
        <div className="text-2xl font-bold pb-2">결제 수단 별 환불 안내</div>
        <ul className="list-disc list-inside">
          <li>
            신용카드 : 승인취소인 경우, 승인한 당일 취소 (매입취소인 경우,
            카드사에 따라 상이함)
          </li>
          <li>실시간 계좌이체 : 익일 본인 계좌로 입금</li>
          <li>무통장 입금 : 익일 환불계좌로 입금</li>
        </ul>
      </div>
    </section>
  );
}
