"use client";

import { useState } from "react";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";

export default () => {
  const buttons = ["배송지 추가", "배송지 목록"];
  const [activeButton, setActiveButton] = useState<string>(buttons[0]);

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
