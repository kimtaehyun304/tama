import { AuthContext } from "@/components/context/AuthContext";
import { useContext, useState } from "react";
import { UseFormRegister } from "react-hook-form";

type SenderFormProps = {
  register: UseFormRegister<SenderFormState>;
};

export default ({ register }: SenderFormProps) => {
  const authContext = useContext(AuthContext);
  const [hasAddress, setHasAddress] = useState<boolean>(false);

  <>
    {/*주문고객 */}
    {/*로그인 유저 ORDER 함수는 sender state 사용X.  */}
    {!authContext?.isLogined && (
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">주문고객</div>
        <div className="p-[2%] space-y-3 max-w-[50rem]">
          <div className="flex items-center">
            <label htmlFor="senderNickname" className="w-32  whitespace-nowrap">
              이름
            </label>
            <input
              id="senderNickname"
              type="text"
              className="border p-3 grow"
              placeholder="주문하시는 분"
              {...register("senderNickname")}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="senderEmail" className="w-32">
              이메일 주소
            </label>
            <input
              id="senderEmail"
              type="text"
              className="border p-3 grow"
              placeholder="이메일 주소"
              {...register("senderEmail")}
            />
          </div>
          <div className="text-[#787878] py-3">
            주문고객님의 정보로 주문정보(주문완료, 배송상태 등)를 안내해
            드립니다.
          </div>
        </div>
      </section>
    )}

    {/*받는고객 */}

    {authContext?.isLogined && hasAddress ? (
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">배송지</div>
        <div className="p-[2%] space-y-3 max-w-[50rem]">
          <div className="flex items-center gap-x-3">
            <div>{receiverNickname}</div>
            <div>{addressName}</div>
            <button
              onClick={() => setIsOpenMemberAddressModal(true)}
              className="border p-3"
            >
              변경
            </button>
            <MemberAddressModal
              addresses={memberAddresses}
              setAddressName={setAddressName}
              setStreetAddress={setStreetAddress}
              setDetailAddress={setDetailAddress}
              setZoneCode={setZoneCode}
              setReceiverNickname={setReceiverNickname}
              setReceiverPhone={setReceiverPhone}
              setIsOpenMemberAddressModal={setIsOpenMemberAddressModal}
              isOpenMemberAddresskModal={isOpenMemberAddressModal}
              setHasAddress={setHasAddress}
            />
          </div>
          <div className="flex flex-wrap gap-x-1">
            <div>{streetAddress}</div>
            <div>{detailAddress}</div>
            <div>({zoneCode})</div>
          </div>
          <div>{receiverPhone}</div>

          <div className="relative flex items-center flex-wrap gap-y-3">
            <label className=" w-32 whitespace-nowrap">배송 메시지 선택</label>
            {/* 정렬 리스트 */}
            <span className="flex flex-col bg-white grow">
              <button
                className="p-3 border text-left"
                onClick={() => setIsActiveUl(!isActiveUl)}
              >
                {isActiveSelfInput ? "직접입력" : deliveryMessage}∨
              </button>

              {isActiveUl && (
                <div className="border space-y-4 absolute z-1 bg-white px-3 whitespace-nowrap w-full">
                  <ul className="space-y-5 my-3">
                    {deliveryMessages.map((message, index) => (
                      <li key={`deliveryMessage${index}`} className="w-full">
                        <button
                          className="w-full text-left"
                          onClick={() => {
                            setIsActiveUl(false);
                            setIsActiveSelfInput(false);
                            setDeliveryMessage(message);
                          }}
                        >
                          {message}
                        </button>
                      </li>
                    ))}
                    <li className="w-full">
                      <button
                        className="w-full text-left"
                        onClick={() => {
                          setIsActiveUl(false);
                          setIsActiveSelfInput(true);
                          setDeliveryMessage("");
                        }}
                      >
                        직접입력
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </span>

            {isActiveSelfInput && (
              <input
                id="deliveryMessage"
                type="text"
                className="border p-3 grow"
                placeholder="베송메시지를 입력하세요"
                onChange={(event) => setDeliveryMessage(event.target.value)}
              />
            )}
          </div>
        </div>
      </section>
    ) : (
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">받는고객</div>
        <div className="p-[2%] space-y-3 max-w-[50rem]">
          <div className="flex items-center">
            <label
              htmlFor="receiverNickname"
              className="w-32 whitespace-nowrap"
            >
              이름
            </label>
            <input
              id="receiverNickname"
              type="text"
              className="border p-3 grow"
              placeholder="받으시는 분"
              value={receiverNickname}
              onChange={(event) => setReceiverNickname(event.target.value)}
              ref={receiverNicknameRef}
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
              value={receiverPhone}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                setReceiverPhone(value);
              }}
              ref={receiverPhoneRef}
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
              value={zoneCode ?? ""}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
                setZoneCode(value == "" ? undefined : Number(value));
              }}
              disabled={isDisabled}
              ref={zoneCodeRef}
            />
            <button
              className="border p-3 ml-auto"
              onClick={() => {
                setIsOpenAddressModal(true);
              }}
            >
              우편번호 찾기
            </button>
          </div>

          <AddressModal
            isOpenAddressModal={isOpenAddressModal}
            setIsOpenAddressModal={setIsOpenAddressModal}
            setZoneCode={setZoneCode}
            setStreetAddress={setStreetAddress}
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
              value={streetAddress}
              onChange={(event) => setStreetAddress(event.target.value)}
              disabled={isDisabled}
              ref={streetAddressRef}
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
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
              ref={detailAddressRef}
            />
          </div>

          <div className="flex items-center flex-wrap gap-y-3">
            <label htmlFor="" className="w-32 whitespace-nowrap">
              배송 메시지 선택
            </label>
            {/* 정렬 리스트 */}
            <span className="relative flex flex-col bg-white grow ">
              <button
                className="p-3 border text-left"
                onClick={() => setIsActiveUl(!isActiveUl)}
              >
                {isActiveSelfInput ? "직접입력" : deliveryMessage}∨
              </button>

              {isActiveUl && (
                <ul className="border space-y-4 z-1 absolute w-full bg-white p-3 whitespace-nowrap ">
                  {deliveryMessages.map((message, index) => (
                    <li key={`deliveryMessage${index}`}>
                      <button
                        onClick={() => {
                          setIsActiveUl(false);
                          setIsActiveSelfInput(false);
                          setDeliveryMessage(message);
                        }}
                      >
                        {message}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        setIsActiveUl(false);
                        setIsActiveSelfInput(true);
                        setDeliveryMessage("");
                      }}
                    >
                      직접입력
                    </button>
                  </li>
                </ul>
              )}
            </span>

            {isActiveSelfInput && (
              <input
                id="deliveryMessage"
                type="text"
                className="border p-3 grow"
                placeholder="베송메시지를 입력하세요"
                onChange={(event) => setDeliveryMessage(event.target.value)}
              />
            )}
          </div>
        </div>
      </section>
    )}

    {/*결제수단 */}
    <section>
      <div className="font-bold text-2xl p-[1%] border-b">결제수단</div>
      <div className="p-[2%] flex gap-x-2 flex-wrap">
        {payMethodLabel.map(({ type, label }) => {
          const isSelected = selectedPayMethod === type;
          return (
            <button
              key={type}
              className={`border p-3 rounded-md ${
                isSelected ? "bg-gray-100 text-black border-black" : "bg-white"
              }`}
              onClick={() => setSelectedPayMethod(type)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>

    {/*주문상품 */}
    <section>
      <div className="font-bold text-2xl p-[1%] border-b">주문상품</div>
      <div className="p-[2%] flex flex-col xl:grid xl:grid-cols-2 gap-3">
        {orderItems.map((item, index) => (
          <div className="border flex gap-x-4 p-2" key={`item-${index}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${item.uploadFile.storedFileName}`}
              alt={item.name}
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-y-2 flex-1">
              <div>
                <div>{item.name}</div>
                <div>
                  {item.color}/{item.sizeStock.size}
                </div>
                <div>{orderMap.get(item.sizeStock.id)}개 주문</div>
              </div>
              <div className="text-sm text-[#aaa]">
                {item.discountedPrice &&
                  `${(
                    item.price * orderMap.get(item.sizeStock.id)!
                  ).toLocaleString("ko-kr")}원`}
              </div>
              <div className="text-2xl font-semibold">
                {item.discountedPrice
                  ? `${(
                      item.discountedPrice * orderMap.get(item.sizeStock.id)!
                    ).toLocaleString("ko-kr")}원`
                  : `${(
                      item.price * orderMap.get(item.sizeStock.id)!
                    ).toLocaleString("ko-kr")}원`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    {!isLoading && orderItems.length != 0 && (
      <>
        {/*주문가격 및 결제하기*/}
        <section className="text-center m-4">
          <div className="bg-[#f5f5f5] inline-block p-4 space-y-3">
            <div className="flex justify-center gap-x-20">
              <span className="grow">상품금액</span>
              <span className="grow">
                {itemTotalPrice.toLocaleString("ko-KR")}원
              </span>
            </div>
            <div className="flex justify-center">
              <span className="">배송비</span>
              <span className="grow text-right">
                {shippingFee.toLocaleString("ko-KR")}원
              </span>
            </div>
            <hr />
            <div className="flex font-semibold text-xl">
              <span>총</span>
              <span className="grow text-right">
                {(itemTotalPrice + shippingFee).toLocaleString("ko-KR")}
              </span>
              원
            </div>
            <div>
              <button
                className="bg-[#131922] text-[#fff] border p-4 w-full"
                onClick={(event) => {
                  event.currentTarget.disabled = true;
                  simpleModalContext?.setMessage("결제창 로딩중..");
                  simpleModalContext?.setIsOpenSimpleModal(true);
                  requestPayment(
                    selectedPayMethod,
                    itemTotalPrice,
                    orderItems.length === 1
                      ? orderItems[0].name
                      : orderItems[0].name + " 등 " + orderItems.length
                  );
                }}
              >
                결제하기
              </button>
            </div>
          </div>
        </section>
      </>
    )}
  </>;
};
