"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { useContext, useState } from "react";
import { useEffect } from "react";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import LoginScreen from "@/components/LoginScreen";
import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";


export default () => {
  const [memberInfo, setMemberInfo] = useState<MemberInformationType>();
  const authContext = useContext(AuthContext);
  const loginModalContext = useContext(LoginModalContext);
  const simpleModalContext = useContext(SimpleModalContext);
  const buttons = ["배송지 추가", "배송지 목록"];
  const [activeButton, setActiveButton] = useState<string>(buttons[0]);
  const changeMemberInfo = (
    key: keyof MemberInformationType,
    value: string | number
  ) => {
    setMemberInfo(
      (prev) =>
        prev && {
          ...prev,
          [key]: value,
        }
    );
  };

  
  function getComponent(activeButton: string) {
    switch (activeButton) {
      case "배송지 추가":
        return <AddressForm />;
      case "배송지 목록":
        return <AddressList />;
    }
  }

  /*
  if (!memberInfo) {
  
    return <LoginScreen />;
  }
    */

  return (
    <section className="space-y-4 grow">
      <div className="flex">
        {buttons.map((button, index) => (
          <button
            onClick={() => {
              setActiveButton(button);
            }}
            className={`border-b p-3 grow ${
              activeButton == button && "border-black font-bold"
            }`}
            key={`button-${index}`}
          >
            {button}
          </button>
        ))}
      </div>
      
      {getComponent(activeButton)}
        

    </section>
  );


};
