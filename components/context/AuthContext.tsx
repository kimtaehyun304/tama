"use client";
import {createContext, useState } from "react";

type AuthContextType = {
  isLogined: boolean;
  setIsLogined: (isLogined: boolean) => void;
};


export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({children} : {children: React.ReactNode}) {
  const [isLogined, setIsLogined] = useState(false);
  return <AuthContext.Provider value={{isLogined, setIsLogined}}>{children}</AuthContext.Provider>;
}

