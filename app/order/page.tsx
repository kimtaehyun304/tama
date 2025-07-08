"use client";

import { AuthContext } from "@/components/context/AuthContext";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import { useContext, useState } from "react";
import Agreements from "./Agreements";
import { useForm } from "react-hook-form";
import OrderForm, {
  DELIVERY_MESSAGES,
  PAY_METHOD_LABELS,
  PayMethodEng,
} from "./OrderForm";
import OrderItems from "./OrderItems";
import OrderButton from "./OrderButton";

export default () => {
  const authContext = useContext(AuthContext);
  const loginModalContext = useContext(LoginModalContext);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  const {
    register: senderFormRegister,
    watch: senderFormWatch,
    setValue: senderFormSetValue,
    setFocus: senderFormSetFocus,
    reset: senderFormReset,
  } = useForm<SenderFormState>({
    defaultValues: {
      senderNickname: "",
      senderEmail: "",
      deliveryMessage: DELIVERY_MESSAGES[0],
    },
  });

  const {
    register: receiverFormRegister,
    watch: receiverFormWatch,
    setValue: receiverFormSetValue,
    setFocus: receiverFormSetFocus,
    reset: receiverFormReset,
  } = useForm<ReceiverFormState>({
    defaultValues: {
      receiverNickname: "",
      receiverPhone: "",
      zoneCode: undefined,
      streetAddress: "",
      detailAddress: "",
      addressName: "",
      memberAddresses: [],
    },
  });

  const [orderItems, setOrderItems] = useState<StorageItemDetailType[]>([]);
  const [orderTotalPrice, setOrderTotalPrice] = useState<number>(0);
  const [orderName, setOrderName] = useState<string>("");

  const [selectedPayMethodEng, setSelectedPayMethodEng] =
    useState<PayMethodEng>(PAY_METHOD_LABELS[0].eng);

  return (
    <article className="xl:mx-standard">
      <div className="text-center font-bold text-3xl py-9 border-b-2 border-black">
        주문서
      </div>
      {!authContext?.isLogined && (
        <div className="text-center bg-[#f8f8f8] py-6">
          <span
            className="font-semibold underline cursor-pointer"
            onClick={() => loginModalContext?.setIsOpenLoginModal(true)}
          >
            로그인
          </span>
          하시면, 더 많은 혜택을 받으실 수 있습니다.
        </div>
      )}

      {!authContext?.isLogined && !isAgreed && (
        <Agreements setIsAgreed={setIsAgreed} />
      )}

      {(authContext?.isLogined || isAgreed) && (
        <>
          <OrderForm
            senderFormRegister={senderFormRegister}
            receiverFormRegister={receiverFormRegister}
            senderFormWatch={senderFormWatch}
            receiverFormWatch={receiverFormWatch}
            senderFormSetValue={senderFormSetValue}
            receiverFormSetValue={receiverFormSetValue}
            selectedPayMethodEng={selectedPayMethodEng}
            setSelectedPayMethodEng={setSelectedPayMethodEng}
            senderFormReset={senderFormReset}
            receiverFormReset={receiverFormReset}
          />

          <OrderItems
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            setOrderTotalPrice={setOrderTotalPrice}
            setOrderName={setOrderName}
          />

          <OrderButton
            senderFormWatch={senderFormWatch}
            receiverFormWatch={receiverFormWatch}
            selectedPayMethodEng={selectedPayMethodEng}
            orderTotalPrice={orderTotalPrice}
            orderName={orderName}
            senderFormSetFocus={senderFormSetFocus}
            receiverFormSetFocus={receiverFormSetFocus}
          />
        </>
      )}
    </article>
  );
};
