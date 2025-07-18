"use client";

import { useContext, useState } from "react";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";
import { AuthContext } from "@/components/context/AuthContext";
import LoginScreen from "@/components/LoginScreen";

export default () => {
  const BUTTONS_STR = ["배송지 추가", "배송지 목록"];
  const [activeButton, setActiveButton] = useState<string>(BUTTONS_STR[0]);
  const authContext = useContext(AuthContext);

  function getComponent(activeButton: string) {
    switch (activeButton) {
      case "배송지 추가":
        return <AddressForm />;
      case "배송지 목록":
        return <AddressList />;
    }
  }

  if (!authContext?.isLogined) {
    return <LoginScreen />;
  }

  return (
    <section className="space-y-4 grow">
      <div className="flex">
        {BUTTONS_STR.map((button, index) => (
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
