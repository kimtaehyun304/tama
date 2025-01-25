"use client";
import { createContext, useState } from "react";

type ModalType = {
  isOpenSimpleModal: boolean;
  setIsOpenSimpleModal: (isOpen: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
};

export const SimpleModalContext = createContext<ModalType | null>(null);

export default function SimpleModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenSimpleModal, setIsOpenSimpleModal] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <SimpleModalContext.Provider
      value={{ isOpenSimpleModal, setIsOpenSimpleModal, message, setMessage }}
    >
      {children}
    </SimpleModalContext.Provider>
  );
}
