"use client";
import { createContext, useState } from "react";

type ModalType = {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal: (isOpen: boolean) => void;
};

export const LoginModalContext = createContext<ModalType | null>(null);

export default function LoginModalProvider({children} : {children: React.ReactNode}) {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  return <LoginModalContext.Provider value={{isOpenLoginModal, setIsOpenLoginModal}}>{children}</LoginModalContext.Provider>;
}
