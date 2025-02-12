"use client";
import { createContext, useState } from "react";

type ModalType = {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal: (isOpen: boolean) => void;
  isContainOrder: boolean;
  setIsContainOrder: (isOpen: boolean) => void;
};

export const LoginModalContext = createContext<ModalType | null>(null);

export default function LoginModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isContainOrder, setIsContainOrder] = useState(false);

  return (
    <LoginModalContext.Provider
      value={{
        isOpenLoginModal,
        setIsOpenLoginModal,
        isContainOrder,
        setIsContainOrder,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}
