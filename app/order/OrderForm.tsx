import { AuthContext } from "@/components/context/AuthContext";
import DaumAddressModal from "@/components/modal/DaumAddressModal";
import MemberAddressModal from "@/components/modal/MemberAddressModal";

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export const PAY_METHOD_LABELS = [
  //{ eng: PayMethodEnum.EASY_PAY, kor: "간편 결제" },
  { eng: "CARD", kor: "신용/체크카드" },
  //{ eng: PayMethodEnum.MOBILE, kor: "휴대폰 결제" },
  { eng: "TRANSFER", kor: "계좌이체" },
] as const;

export const DELIVERY_MESSAGES = [
  "배송 전에 미리 연락 바랍니다.",
  "부재 시 경비실에 맡겨 주세요.",
  "부재 시 문 앞에 놓아주세요.",
  "부재 시 전화나 문자 주세요.",
  "택배함에 넣어주세요.",
];

export type PayMethodEng = (typeof PAY_METHOD_LABELS)[number]["eng"];

type Props = {
  senderFormRegister: UseFormRegister<SenderFormState>;
  receiverFormRegister: UseFormRegister<ReceiverFormState>;
  senderFormWatch: UseFormWatch<SenderFormState>;
  receiverFormWatch: UseFormWatch<ReceiverFormState>;
  senderFormSetValue: UseFormSetValue<SenderFormState>;
  receiverFormSetValue: UseFormSetValue<ReceiverFormState>;
  senderFormReset: UseFormReset<SenderFormState>;
  receiverFormReset: UseFormReset<ReceiverFormState>;
  selectedPayMethodEng: PayMethodEng;
  setSelectedPayMethodEng: Dispatch<SetStateAction<PayMethodEng>>;
};

export default ({
  senderFormRegister,
  receiverFormRegister,
  senderFormWatch,
  receiverFormWatch,
  senderFormSetValue,
  receiverFormSetValue,
  senderFormReset,
  receiverFormReset,
  selectedPayMethodEng,
  setSelectedPayMethodEng,
}: Props) => {
  const authContext = useContext(AuthContext);
  const [isOpenMemberAddressModal, setIsOpenMemberAddressModal] =
    useState<boolean>(false);
  const [isOpenDaumAddressModal, setIsOpenDaumAddressModal] =
    useState<boolean>(false);

  //배송메시지 리스트
  const [isShowDeliveryMsgs, setIsShowDeliveryMsgs] = useState<boolean>(false);
  //배송메시지 직접입력
  const [isSelfDeliveryMsg, setIsSelfDeliveryMsg] = useState<boolean>(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const DeliveryMessageBox = (
    <div className="relative flex items-center flex-wrap gap-y-3">
      <label className=" w-32 whitespace-nowrap">배송 메시지 선택</label>

      <span className="flex flex-col bg-white grow">
        <button
          className="p-3 border text-left"
          onClick={() => setIsShowDeliveryMsgs(!isShowDeliveryMsgs)}
        >
          {isSelfDeliveryMsg ? "직접입력" : senderFormWatch("deliveryMessage")}∨
        </button>

        {isShowDeliveryMsgs && (
          <div className="border space-y-4 absolute z-1 bg-white px-3 whitespace-nowrap w-full">
            <ul className="space-y-5 my-3">
              {DELIVERY_MESSAGES.map((message, index) => (
                <li key={`deliveryMessage${index}`} className="w-full">
                  <button
                    className="w-full text-left"
                    onClick={() => {
                      setIsShowDeliveryMsgs(false);
                      setIsSelfDeliveryMsg(false);
                      senderFormSetValue("deliveryMessage", message);
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
                    setIsShowDeliveryMsgs(false);
                    setIsSelfDeliveryMsg(true);
                    senderFormSetValue("deliveryMessage", "");
                  }}
                >
                  직접입력
                </button>
              </li>
            </ul>
          </div>
        )}
      </span>

      {isSelfDeliveryMsg && (
        <input
          id="deliveryMessage"
          type="text"
          className="border p-3 grow"
          placeholder="베송메시지를 입력하세요"
          {...senderFormRegister("deliveryMessage")}
        />
      )}
    </div>
  );

  //전역 객체 할당 딜레이 때문에 필요
  //로그인한 유저는 기본 값 설정
  useEffect(() => {
    async function fetchMemberOrderSetUp() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/order-setup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
          },
        }
      );

      if (res.ok) {
        const memebrOrderSetUp: MemberOrderSetUpType = await res.json();
        receiverFormSetValue("memberAddresses", memebrOrderSetUp.addresses);
        senderFormSetValue("senderNickname", memebrOrderSetUp.nickname);
        senderFormSetValue("senderEmail", memebrOrderSetUp.email);

        const defaultAddress: AddressResponse | undefined =
          memebrOrderSetUp.addresses.find(
            (address) => address.isDefault == true
          );

        if (defaultAddress) {
          receiverFormSetValue("hasAddress", true);
          receiverFormSetValue(
            "receiverNickname",
            defaultAddress.receiverNickname
          );
          receiverFormSetValue("receiverPhone", defaultAddress.receiverPhone);
          receiverFormSetValue("zoneCode", Number(defaultAddress.zipCode));
          receiverFormSetValue("streetAddress", defaultAddress.street);
          receiverFormSetValue("detailAddress", defaultAddress.detail);
          receiverFormSetValue("addressName", defaultAddress.name);
        }
      }
    }
    if (authContext?.isLogined) fetchMemberOrderSetUp();

    if (!authContext?.isLogined) {
      senderFormReset();
      receiverFormReset();
    }
  }, [authContext?.isLogined]);

  return (
    <>
      {/*주문고객 */}
      {/*로그인 유저는 폼 없어도 자동 할당*/}

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
              {...senderFormRegister("senderNickname")}
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
              {...senderFormRegister("senderEmail")}
            />
          </div>
          <div className="text-[#787878] py-3">
            주문고객님의 정보로 주문정보(주문완료, 배송상태 등)를 안내해
            드립니다.
          </div>
        </div>
      </section>

      {/*받는고객 */}
      {receiverFormWatch("hasAddress") && (
        <section>
          <div className="font-bold text-2xl p-[1%] border-b">배송지</div>
          <div className="p-[2%] space-y-3 max-w-[50rem]">
            <div className="flex items-center gap-x-3">
              <div>{receiverFormWatch("receiverNickname")}</div>
              <div>{receiverFormWatch("addressName")}</div>
              <button
                onClick={() => setIsOpenMemberAddressModal(true)}
                className="border p-3"
              >
                변경
              </button>
              <MemberAddressModal
                addresses={receiverFormWatch("memberAddresses")}
                setValue={receiverFormSetValue}
                isOpenMemberAddressModal={isOpenMemberAddressModal}
                setIsOpenMemberAddressModal={setIsOpenMemberAddressModal}
              />
            </div>
            <div className="flex flex-wrap gap-x-1">
              <div>{receiverFormWatch("streetAddress")}</div>
              <div>{receiverFormWatch("detailAddress")}</div>
              <div>{receiverFormWatch("zoneCode")}</div>
            </div>
            <div>{receiverFormWatch("receiverPhone")}</div>
            {DeliveryMessageBox}
          </div>
        </section>
      )}

      {!receiverFormWatch("hasAddress") && (
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
                {...receiverFormRegister("receiverNickname")}
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
                {...receiverFormRegister("receiverPhone", {
                  onChange: (event) => {
                    const onlyNums = event.target.value.replace(/\D/g, "");
                    receiverFormSetValue("receiverPhone", onlyNums);
                  },
                })}
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
                disabled={isDisabled}
                {...receiverFormRegister("zoneCode", {
                  onChange: (event) => {
                    const value = event.target.value.replace(/\D/g, "");
                    receiverFormSetValue(
                      "zoneCode",
                      value === "" ? undefined : Number(value)
                    );
                  },
                })}
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
                receiverFormSetValue("streetAddress", value)
              }
              setZoneCode={(value: number) =>
                receiverFormSetValue("zoneCode", value)
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
                {...receiverFormRegister("streetAddress")}
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
                {...receiverFormRegister("detailAddress")}
              />
            </div>
            {DeliveryMessageBox}
          </div>
        </section>
      )}

      {/*결제수단 */}
      <section>
        <div className="font-bold text-2xl p-[1%] border-b">결제수단</div>
        <div className="p-[2%] flex gap-x-2 flex-wrap">
          {PAY_METHOD_LABELS.map(({ eng, kor }) => {
            return (
              <button
                key={eng}
                className={`border p-3 rounded-md ${
                  selectedPayMethodEng === eng
                    ? "bg-gray-100 text-black border-black"
                    : "bg-white"
                }`}
                onClick={() => setSelectedPayMethodEng(eng)}
              >
                {kor}
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
};
