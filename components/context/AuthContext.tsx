"use client";
import { createContext, useState } from "react";

type AuthContextType = {
  isLogined: boolean | undefined;
  setIsLogined: (isLogined: boolean | undefined) => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogined, setIsLogined] = useState<boolean | undefined>(undefined);

  return (
    <AuthContext.Provider value={{ isLogined, setIsLogined }}>
      {children}
    </AuthContext.Provider>
  );
}
